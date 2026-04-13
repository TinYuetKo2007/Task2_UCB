require("dotenv").config();
const transporter = require("./transporter");
const jwt =  require("jsonwebtoken");
const helmet = require('helmet');
const express = require("express");
const bcrypt = require("bcrypt");

const crypto = require("crypto");
const { updateStock, fetchOne, fetchAll, execute, appDB } = require("./db");
const stripe = require("stripe")(process.env.STRIPE_API_KEY)
const cors = require ("cors");
const { verify } = require("./verify");
const multer = require("multer");
const app = express();

app.get("/", (req, res) => res.send("Connection successful"));

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Middleware looks at code before request is sent to server
app.use(express.json());
// converts body into object
app.use(express.urlencoded({ extended: true }));

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "frame-ancestors": ["'none'"]
    },
  })
);

app.use(
  helmet.frameguard({
    action: 'deny',
  })
);

// REGISTER NEW USER

app.post("/signup", async (req, res) => {
    const {forename, surname, email, password} = req.body;
    try {
        const hash = await bcrypt.hash(password, 10)
        appDB.run(`INSERT INTO users (forename, surname, email, password, role) VALUES (?,?,?,?,?)`, 
          [forename, surname, email, hash, "USER"], function (err) {
            if (err)
                return res.status(400).json({success: false, message: err.message})
            res.json({success: true})
        });
    } catch (err) {
        res.status(500).json({success: false, message: "Registration failed"})
    }
});


//LOGIN USER
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    appDB.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!row)
        return res.status(401).json({ success: false, message: "User not found" });
  
      // Compare passwords
      const match = await bcrypt.compare(password, row.password);
      if (match) {
        console.log(process.env.JWT_LIFETIME)

        const token = jwt.sign({ email, id: row.id, role: row.role }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_LIFETIME
        });
        res.json({ success: true, message: "Login successful", token });
      } else {
        res.status(401).json({ success: false, message: "Invalid password" });
      }
    });
  });


app.post("/create-checkout-session", async (req, res) => {
  try {
    const { basket, address, deliveryMethod } = req.body;

    if (!basket || basket.length === 0) {
      return res.status(400).json({ error: "Basket is empty" });
    }

    const preparedBasket = basket.map(item => ({
      id: item.id,
      productId: item.productId,
      title: item.title || "Item",
      price: item.price,
      image: item.image || "",
      quantity: item.quantity || 1
    }));

    if (deliveryMethod === "delivery") {

      const deliveryProduct = await fetchOne(
        appDB,
        "SELECT * FROM products WHERE title = ?",
        ["Delivery Fee"]
      );

      if (!deliveryProduct) {
        return res.status(400).json({ error: "Delivery fee not found" });
      }

      preparedBasket.push({
        id: deliveryProduct.id,
        productId: deliveryProduct.productId,
        title: deliveryProduct.title,
        price: deliveryProduct.price,
        image: deliveryProduct.image || "",
        quantity: 1
      });
    }

    const lineItems = preparedBasket.map(item => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : []
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      metadata: {
        basket: JSON.stringify(preparedBasket),
        address: address || "collection",
        deliveryMethod
      },
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/basket`
    });

    console.log("Basket sent to Stripe:", preparedBasket);

    res.json({ url: session.url });

  } catch (err) {
    console.error("CREATE CHECKOUT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/contact-messages", async (req, res) => {
  const { email, text } = req.body;
  const date = new Date().toISOString(); 

  const sql = `INSERT INTO contactMessages(email, text, date) VALUES(?, ?, ?)`;
  
  try {
      await execute(appDB, sql, [email, text, date]);
      res.json({ success: true, message: "Message sent!" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Error saving message" });
  } 
});

app.post("/products", verify, async (req, res) => {
  const {
    title,
    description,
    image,
    price,
    category,
    stock,
    producerId
  } = req.body;

  let stripeProduct = null;
  let stripePrice = null;

  try {
    if (req.user.role !== "ADMIN" && req.user.role !== "PRODUCER") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const finalProducerId =
      req.user.role === "PRODUCER"
        ? req.user.id
        : producerId;

    if (!finalProducerId) {
      return res.status(400).json({ error: "Missing producer ID" });
    }

    stripeProduct = await stripe.products.create({
      name: title,
      description,
      images: image ? [image] : [],
      metadata: {
        category,
        producerId: finalProducerId
      }
    });

    stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(price * 100),
      currency: "gbp"
    });

    await execute(
      appDB,
      `INSERT INTO products
      (title, description, price, priceId, productId, image, category, stock, producerId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        price,
        stripePrice.id,
        stripeProduct.id,
        image,
        category,
        stock,
        finalProducerId
      ]
    );

    return res.json({
      success: true,
      message: "Product created successfully"
    });

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);

    try {
      if (stripeProduct?.id) {
        await stripe.products.del(stripeProduct.id);
      }
    } catch (rollbackErr) {
      console.error("ROLLBACK FAILED:", rollbackErr.message);
    }

    return res.status(500).json({
      success: false,
      error: "Failed to create product"
    });
  }
});

app.get("/products/:id", async (req, res) => {
  const product = await fetchOne(
    appDB,
    "SELECT * FROM products WHERE id = ?",
    [req.params.id]
  );

  res.json(product);
});
// Get products from product catalog
app.get("/stripe-products", async (req, res) => {
  try {

    const products = await stripe.products.list({active: true, limit: 100 });
    console.log("Stripe products:", products.data);

    const prices = await stripe.prices.list({ limit: 100 });
    console.log("Stripe prices:", prices.data);

    const formattedProducts = products.data.map(product => {

      const price = prices.data.find(
        p => p.product === product.id
      );

      return {
        title: product.name,
        description: product.description,
        image: product.images?.[0] || "",
        price: price ? price.unit_amount / 100 : 0,
        productId: product.id,
        priceId: price ? price.id : null,
        category: product.metadata.category || "General"
      };
    });

    console.log("Formatted:", formattedProducts);

    res.json(formattedProducts);

  } catch (err) {
    console.error("Stripe fetch error:", err.message);
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/sync-stripe-products", verify, async (req, res) => {

  if (req.user.role !== "ADMIN" && req.user.role !== "PRODUCER") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {

    console.log("Syncing Stripe catalog...");

    const productsRes = await stripe.products.list({
      limit: 100,
      active: true
    });

    const pricesRes = await stripe.prices.list({
      limit: 100
    });

    const priceMap = {};
    for (const price of pricesRes.data) {
      if (!priceMap[price.product]) {
        priceMap[price.product] = price;
      }
    }

    for (const product of productsRes.data) {

      const price = priceMap[product.id];
      if (!price) continue;

      await execute(
        appDB,
        `INSERT OR IGNORE INTO products
        (title, description, price, priceId, productId, image, category, stock, producerId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.description || "",
          price.unit_amount / 100,
          price.id,
          product.id,
          product.images?.[0] || "",
          product.metadata?.category || "general",
          0,
          req.user.id
        ]
      );
    }

    console.log("Stripe sync completed");

    res.json({ success: true });

  } catch (err) {
    console.error("SYNC ERROR:", err);
    res.status(500).json({ error: "Stripe sync failed" });
  }
});


// Forget password
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required"
      });
    }

    const user = await fetchAll(
      appDB,
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "This email is not linked to any account"
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 1000 * 60 * 15;

    await execute(
      appDB,
      `UPDATE users
       SET resetToken = ?, resetTokenExpiry = ?
       WHERE id = ?`,
      [token, expiry, user[0].id]
    );

    const resetLink =
      `${process.env.CLIENT_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"SERN Support" <${process.env.EMAIL_USER}>`,
      to: user[0].email,
      subject: "Password Reset",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset password</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    });

    res.json({
      success: true,
      message: "Reset link sent"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.post("/reset-password/:token", async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;

  try {
    const users = await fetchAll(
      appDB,
      "SELECT * FROM users WHERE resetToken = ?",
      [token]
    );
    if (!users.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid token"
      });
    }
    const user = users[0];
    if (Date.now() > user.resetTokenExpiry) {
      return res.status(400).json({
        success: false,
        message: "Token expired"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await execute(
      appDB,
      `UPDATE users 
       SET password = ?, resetToken = NULL, resetTokenExpiry = NULL
       WHERE id = ?`,
      [hashedPassword, user.id]
    );

    res.json({
      success: true,
      message: "Password reset successful"
    });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});



app.get("/producerApplications", async (req, res) => {
  try {
    console.log("Route hit");

    const applications = await fetchAll(
      appDB,
      "SELECT * FROM producerApplications"
    );

    console.log(applications);

    res.json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



app.use(verify);
/* JWT is valid or not
 Returns actual user as object */
app.get("/me", verify, (req, res) => {
  return res.json(req.user)
});
app.get("/me/profile", verify, async (req, res) => {
  const users = await fetchAll(appDB, `SELECT * FROM users WHERE email = ?`, [req.user.email]);
  return res.json(users[0]);
});

app.put("/users/me", verify, async (req, res) => {
  try {
    const userId = req.user.id;
    const {forename, surname, email } = req.body;

    if (!forename || !surname || !email) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    await execute(
      appDB,
      `
      UPDATE users
      SET forename = ?, surname = ?, email = ?
      WHERE id = ?
      `,
      [forename, surname, email, userId]
    );

    res.json({
      success: true,
      message: "Profile updated"
    });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({
      error: "Update failed"
    });
  }
});

app.get("/me/orders", verify, async (req, res) => {
  try {

    const rows = await fetchAll(
      appDB,
      `
      SELECT 
        orders.id as orderId,
        orders.total,
        orders.deliveryMethod,
        orders.address,
        orders.status,
        orders.createdAt,

        orderProducts.productId,
        orderProducts.title,
        orderProducts.image,
        orderProducts.price,
        orderProducts.quantity

      FROM orders

      LEFT JOIN orderProducts
      ON orders.id = orderProducts.orderId

      WHERE orders.userId = ?

      ORDER BY orders.createdAt DESC
      `,
      [req.user.id]
    );

    res.json(rows);

  } catch (err) {
    console.error("ORDERS FETCH ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/orders/store", verify, async (req, res) => {
  console.log("STORE ORDER HIT", req.body);

  try {
    const { sessionId } = req.body;

    if (!sessionId)
      return res.status(400).json({ error: "No session ID" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session)
      return res.status(400).json({ error: "Session not found" });

    if (session.payment_status !== "paid")
      return res.status(400).json({ error: "Payment not completed" });

    let basket = [];

    try {
      basket = session.metadata.basket
        ? JSON.parse(session.metadata.basket)
        : [];
    } catch (err) {
      console.log("Basket parse error:", err);
      return res.status(400).json({ error: "Invalid basket data" });
    }

    const address = session.metadata.address || "";
    const deliveryMethod = session.metadata.deliveryMethod || "collection";

    const order = await execute(
      appDB,
      `INSERT INTO orders 
       (userId, deliveryMethod, address, stripeSessionId, total, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        deliveryMethod,
        address,
        session.id,
        session.amount_total / 100,
        "paid"
      ]
    );

    const orderId = order.lastID;

 for (const item of basket) {

      console.log("Processing item:", item);

      await execute(
        appDB,
        `INSERT INTO orderProducts
        (orderId, productId, quantity, price, title, image)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.productId,
          item.quantity,
          item.price,
          item.title,
          item.image
        ]
      );

      // skip delivery fee
      if (item.title === "Delivery Fee") continue;

      // decrease stock using DB id
      await updateStock(item.id, -item.quantity);

    }

        res.json({ success: true, orderId });

      } catch (err) {
        console.error("STORE ORDER ERROR:", err);
        res.status(500).json({ error: "Server error" });
      }
});

// only work for admins
app.get("/users", async (req, res) => {
    const userid = req.user.id;
    if (req.user.role !== "ADMIN") {
      return res.json({success: false})
    }
  const users = await fetchAll(appDB, `SELECT email, role FROM users`)
  return res.json({users}) // Returns reports to user
})

app.get("/contact-messages", verify, async (req, res) => {

  if (
    req.user.role !== "ADMIN" &&
    req.user.role !== "PRODUCER"
  ) {
    return res.status(403).json({
      error: "Access denied"
    });
  }

  try {

    const messages = await fetchAll(
      appDB,
      "SELECT * FROM contactMessages ORDER BY date DESC"
    );

    res.json(messages);

  } catch (err) {

    console.error("CONTACT MESSAGES ERROR:", err);

    res.status(500).json({
      error: "Failed to fetch messages"
    });

  }
});

app.put("/contact-messages/:id", verify, (req, res) => {

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied" });
    }

    const id = req.params.id;
    const { email, text, date } = req.body;

    appDB.run(
        `UPDATE contactMessages 
         SET email = ?, text = ?, date = ?
         WHERE id = ?`,
        [email, text, date, id],
        function (err) {

            if (err) {
                return res.status(500).json({ error: "Update failed" });
            }

            res.json({ success: true });
        }
    );
});
app.put("/users/me", verify, async (req, res) => {
  try {
    const userId = req.user.id;
    const {forename, surname, email } = req.body;

    if (!forename || !surname || !email) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    await execute(
      appDB,
      `
      UPDATE users
      SET forename = ?, surname = ?, email = ?
      WHERE id = ?
      `,
      [forename, surname, email, userId]
    );

    res.json({
      success: true,
      message: "Profile updated"
    });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({
      error: "Update failed"
    });
  }
});

app.delete("/users/:id", verify, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  const userId = req.params.id;

  try {
    await execute(appDB, "DELETE FROM users WHERE id = ?", [userId]);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

app.delete("/products/:id", verify, async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await fetchOne(
      appDB,
      "SELECT * FROM products WHERE id = ?",
      [productId]
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const isAdmin = req.user.role === "ADMIN";
    const isOwner = product.producerId === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (product.productId) {
      try {
        await stripe.products.update(product.productId, { active: false });
      } catch (err) {
        console.log("Stripe archive failed:", err.message);
      }
    }

    await execute(
      appDB,
      "DELETE FROM products WHERE id = ?",
      [productId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// Editing data table
app.put("/:type/:id", verify, async (req, res) => {

  const { type, id } = req.params;
  const data = req.body;

  console.log("TYPE:", type);
  console.log("ID:", id);
  console.log("BODY:", data);

  try {

    if (!["products", "users"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Products

  if (type === "products") {

    if (req.user.role !== "PRODUCER" && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { title, price, description, stock } = data;

    if (!title || price === undefined || !description || stock === undefined) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const product = await fetchOne(
      appDB,
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let finalPriceId = product.priceId;

    // Only create new Stripe price if price changed
    if (product.productId && Number(price) !== Number(product.price)) {
      try {
        const newPrice = await stripe.prices.create({
          product: product.productId,
          unit_amount: Math.round(Number(price) * 100),
          currency: "gbp"
        });

        finalPriceId = newPrice.id;

      } catch (err) {
        console.log("Stripe price update failed:", err.message);
      }
    }

    await execute(
      appDB,
      `UPDATE products
      SET title = ?, 
          price = ?, 
          description = ?, 
          stock = ?,
          priceId = ?
      WHERE id = ?`,
      [
        title,
        Number(price),
        description,
        Number(stock),
        finalPriceId,
        id
      ]
    );

    return res.json({
      message: "Product updated successfully"
    });
  }

    // Users

    if (type === "users") {

      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const { email, balance } = data;

      if (!email || balance === undefined) {
        return res.status(400).json({ error: "Missing fields" });
      }

      await execute(
        appDB,
        `UPDATE users
         SET email = ?, balance = ?
         WHERE id = ?`,
        [email, Number(balance), id]
      );

      return res.json({ message: "User updated successfully" });
    }

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/products", verify, async (req, res) => {
  try {

    let products = [];

    switch (req.user.role) {

      case "PRODUCER":
        products = await fetchAll(
          appDB,
          `SELECT * FROM products
           WHERE producerId = ?
           AND title != 'Delivery Fee'`,
          [req.user.id]
        );
        break;

      case "ADMIN":
        products = await fetchAll(
          appDB,
          `SELECT * FROM products`
        );
        break;

      case "USER":
        products = await fetchAll(
          appDB,
          `SELECT * FROM products
           WHERE title != 'Delivery Fee'
           AND stock > 0`
        );
        break;

      default:
        return res.status(403).json({
          error: "Unauthorized"
        });
    }

    res.json(products);

  } catch (err) {

    console.error("GET PRODUCTS ERROR:", err);

    res.status(500).json({
      error: "Failed to fetch products"
    });

  }
});

// Producer Application
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.post("/producer-application", verify, upload.single("hygiene_cert"), async (req, res) => {
    try {

      const userId = req.user.id;

      // get real email from DB
      const user = await fetchOne(
        appDB,
        "SELECT email FROM users WHERE id = ?",
        [userId]
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const email = user.email;

      const {
        producerName,
        address,
        description,
        fsa_rating
      } = req.body;

      let certificate = null;

      if (req.file) {
        certificate = `http://localhost:4000/uploads/${req.file.filename}`;
      }
      
      const existing = await fetchOne(
        appDB,
        `SELECT * FROM producerApplications 
        WHERE userId = ?
        ORDER BY id DESC
        LIMIT 1`,
        [userId]
      );

      if (existing && existing.status === "PENDING") {
        return res.status(400).json({
          error: "You already have a pending application"
        });
      }

      if (existing && existing.status === "APPROVED") {
        return res.status(400).json({
          error: "You are already a producer"
        });
      }
      
      if (!producerName || !address || !description || !fsa_rating) {
        return res.status(400).json({
          error: "All fields are required"
        });
      }

      await execute(
        appDB,
        `INSERT INTO producerApplications
        (email, userId, producerName, address, description, fsaRating, hygieneCertUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          email,
          userId,
          producerName,
          address,
          description,
          fsa_rating,
          certificate
        ]
      );

      res.json({ success: true });

    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false });
    }
  }
);

app.put("/producerApplications/:id/approve", verify, async (req, res) => {
  try {

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin only" });
    }

    const { id } = req.params;

    const application = await fetchOne(
      appDB,
      "SELECT * FROM producerApplications WHERE id = ?",
      [id]
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    await execute(
      appDB,
      `UPDATE producerApplications
       SET status = 'APPROVED'
       WHERE id = ?`,
      [id]
    );

    await execute(
      appDB,
      `UPDATE users
       SET role = 'PRODUCER'
       WHERE id = ?`,
      [application.userId]
    );

    res.json({ message: "Application approved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/producerApplications/:id/deny", verify, async (req, res) => {
  try {

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin only" });
    }

    const { id } = req.params;
    const { reason } = req.body;

    await execute(
      appDB,
      `UPDATE producerApplications
       SET status = 'DENIED',
           denialReason = ?
       WHERE id = ?`,
      [reason || null, id]
    );

    res.json({ message: "Application denied" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/reports", verify, async (req, res) => {
  const userid = req.user.id;
  const reports = await fetchAll(appDB, `SELECT * FROM reports WHERE id = ?`, [userid])
  return res.json({reports}) // Returns reports to user
});

app.post("/reports", verify, async (req, res) => {
    const { title, text } = req.body;
    const userid = req.user.id;
    const sql = `INSERT INTO reports(id, title, text) VALUES(?, ?, ?)`;
  try {
    const note = await execute(appDB, sql, [userid, title, text]);
    res.json({note, success: true})
  } catch (err) {
    console.log(err);
    res.status(500).json({success: false, message: "Error creating reports"})
  } 
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));