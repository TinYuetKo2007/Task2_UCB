require("dotenv").config();
const jwt =  require("jsonwebtoken");
const helmet = require('helmet');
const express = require("express");
const bcrypt = require("bcrypt");
const { appDB, fetchAll, execute } = require("./db")
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_API_KEY)
const cors = require ("cors");
const { verify } = require("./verify");
const app = express();

app.get("/", (req, res) => res.send("Connection successful"));



app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Middleware looks at code before request is sent to server
app.use(express.json());
// converts body into object
app.use(express.urlencoded({ extended: true }));

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
    const {username, forename, surname, password} = req.body;
    try {
        const hash = await bcrypt.hash(password, 10)
        appDB.run(`INSERT INTO users (username, forename, surname, password, role) VALUES (?,?,?,?,?)`, [username, forename, surname, hash, "USER"], function (err) {
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
    const { username, password } = req.body;
    appDB.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!row)
        return res.status(401).json({ success: false, message: "User not found" });
  
      // Compare passwords
      const match = await bcrypt.compare(password, row.password);
      if (match) {
        console.log(process.env.JWT_LIFETIME)
        // Pass in user data + create token
        const token = jwt.sign({ username, id: row.id, role: row.role }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_LIFETIME
        });
        res.json({ success: true, message: "Login successful", token });
      } else {
        res.status(401).json({ success: false, message: "Invalid password" });
      }
    });
  });
// User permanently deletes account
app.delete("/users/me", verify, async (req, res) => {
  try {
    const userId = req.user.id;

    await execute(appDB,
      "DELETE FROM users WHERE id = ?",
      [userId]
    );

    res.json({
      success: true,
      message: "Account deleted"
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Delete failed"
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
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  const productId = req.params.id;

  try {
    const row = await new Promise((resolve, reject) => {
      appDB.get("SELECT productId FROM products WHERE id = ?", [productId], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (row && row.productId) {
      await stripe.products.update(row.productId, { active: false });
    }

    await execute(appDB, "DELETE FROM products WHERE id = ?", [productId]);

    res.json({ success: true, message: "Product removed from DB and Stripe" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

app.post("/create-checkout-session", verify, async (req, res) => {
  console.log("User making purchase:", req.user);

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Items array is missing or invalid" });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: items.map(item => ({
        price: item.priceId || item.priceid,
        quantity: parseInt(item.quantity) || 1
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/products?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/products?canceled=true`,
      metadata: {
        userId: req.user.id
      }
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Carbon footprint calculator
const emissionFactors = {
  petrol: 0.17,
  diesel: 0.168,
  electric: 0.053,
  hybrid: 0.11,
  bus: 0.103,
  train: 0.035,
  tram: 0.045,
  electricity: 0.193,
  gas: 0.182,
};

app.post("/calculate", (req, res) => {
  const {
    carType,
    milesPerWeek,
    busRides,
    trainRides,
    tramRides,
    electricBill,
    gasBill,
  } = req.body;

  console.log("Received calc request:", req.body);

  const miles = parseFloat(milesPerWeek) || 0;
  const bus = parseFloat(busRides) || 0;
  const train = parseFloat(trainRides) || 0;
  const tram = parseFloat(tramRides) || 0;
  const electric = parseFloat(electricBill) || 0;
  const gas = parseFloat(gasBill) || 0;

  let transportFootprint = 0;
  let energyFootprint = 0;

  if (carType && emissionFactors[carType]) {
    transportFootprint += miles * emissionFactors[carType];
  }

  transportFootprint += bus * 1.60934 * emissionFactors.bus;
  transportFootprint += train * 1.60934 * emissionFactors.train;
  transportFootprint += tram * 1.60934 * emissionFactors.tram;

  energyFootprint += electric * emissionFactors.electricity;
  energyFootprint += gas * emissionFactors.gas;

  const totalFootprint = transportFootprint + energyFootprint;

  appDB.run(
    `INSERT INTO calculations 
    (carType, milesPerWeek, busRides, trainRides, tramRides, electricBill, gasBill, totalFootprint)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [carType, miles, bus, train, tram, electric, gas, totalFootprint],
    function (err) {
      if (err) {
        console.error("Insert error:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: this.lastID,
        totalFootprint,
        transportFootprint,
        energyFootprint,
      });
    }
  );
});

app.get("/reports", verify, async (req, res) => {
  const userid = req.user.id;
  const reports = await fetchAll(appDB, `SELECT * FROM reports WHERE user_id = ?`, [userid])
  return res.json({reports}) // Returns reports to user
});

app.post("/reports", verify, async (req, res) => {
    const { title, text } = req.body;
    const userid = req.user.id;
    const sql = `INSERT INTO reports(user_id, title, text) VALUES(?, ?, ?)`;
  try {
    const note = await execute(appDB, sql, [userid, title, text]);
    res.json({note, success: true})
  } catch (err) {
    console.log(err);
    res.status(500).json({success: false, message: "Error creating reports"})
  } 
});

app.post("/contact-messages", async (req, res) => {
  const { email, text } = req.body;
  const date = new Date().toISOString(); // Generate current timestamp

  const sql = `INSERT INTO contactMessages(email, text, date) VALUES(?, ?, ?)`;
  
  try {
      await execute(appDB, sql, [email, text, date]);
      res.json({ success: true, message: "Message sent!" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Error saving message" });
  } 
});
app.get("/contact-messages", verify, async (req, res) => {
  const sql = `SELECT * FROM contactMessages ORDER BY date DESC`;

  try {
    const contactMessages = await fetchAll(appDB, sql);

    res.json({ contactMessages });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching messages"
    });
  }
});

app.get("/products", async (req, res) => {
  const products = await fetchAll(appDB, "SELECT * FROM products");
  res.json(products);
});

app.post("/products", async (req, res) => {
  const { title, description, image, price } = req.body;

  try {

    // Product properties
    const stripeProduct = await stripe.products.create({
      name: title,
      description: description,
      images: [image],
    });

    // Create price
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: price * 100,
      currency: "gbp"
    });

    // Save to DB
    const product = await execute(
      appDB,
      `INSERT INTO products (title, description, image, price, productId, priceId)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        image,
        price,
        stripeProduct.id,
        stripePrice.id
      ]
    );

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
    console.log(err)
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

    const products = await stripe.products.list({ limit: 100 });
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
        priceId: price ? price.id : null
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

app.post("/sync-stripe-products", async (req, res) => {
  try {

    const products = await stripe.products.list({ limit: 100, active: true });
    const prices = await stripe.prices.list({ limit: 100 });

    for (const product of products.data) {

      const price = prices.data.find(
        p => p.product === product.id
      );

      const exists = await fetchAll(
        appDB,
        "SELECT * FROM products WHERE productId = ?",
        [product.id]
      );

      if (exists.length === 0) {

        await execute(
          appDB,
          `INSERT INTO products
          (title, description, image, price, category, productId, priceId)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            product.name,
            product.description,
            product.images?.[0] || "",
            price ? price.unit_amount / 100 : 0,
            "General",
            product.id,
            price ? price.id : null
          ]
        );

        console.log("Inserted:", product.name);
      }
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Sync error:", err);
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
  const users = await fetchAll(appDB, `SELECT * FROM users WHERE username = ?`, [req.user.username]);
  return res.json(users[0]);
});
app.get("/me/orders", verify, async (req, res) => {
  const orders = await fetchAll(appDB, `SELECT * FROM orders WHERE user_id = ?`, [req.user.id]);
  return res.json({orders});
});

// only work for admins
app.get("/users", async (req, res) => {
    const userid = req.user.id;
    if (req.user.role !== "ADMIN") {
      return res.json({success: false})
    }
  const users = await fetchAll(appDB, `SELECT username, role FROM users`)
  return res.json({users}) // Returns reports to user
})

app.listen(4000, () => console.log("Server running on http://localhost:4000"));