require("dotenv").config();
const jwt =  require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const { appDB, fetchAll, execute } = require("./db")
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_API_KEY)
const cors = require ("cors");
const { verify } = require("./verify");

app.get("/", (req, res) => res.send("Connection successful"));

// Middleware looks at code before request is sent to server
app.use(bodyParser.json());
app.use(express.json());
// converts body into object

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.urlencoded({ extended: true }));
// REGISTER NEW USER

app.post("/signup", async (req, res) => {
    const {username, password} = req.body;
    try {
        const hash = await bcrypt.hash(password, 10)
        appDB.run(`INSERT INTO users (username, password, role) VALUES (?,?,?)`, [username, hash, "USER"], function (err) {
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
    //console.log(username, password)
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
  
app.use(verify);
/* JWT is valid or not
 Returns actual user as object */
app.get("/me", verify, (req, res) => {
  return res.json(req.user)
});

app.post("/create-checkout-session", async (req, res) => {
  try {
  const { priceId } = req.body;
  console.log( req.body )
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "payment",
    success_url: `${ process.env.CLIENT_URL }/products?success=true`,
    cancel_url: `${ process.env.CLIENT_URL }/products?canceled=true`
  });
  res.redirect(session.url) // For forms with no onSubmit, takes user to payment
} catch (err) {
  res.status(500).json({ error: err.message });
}
})

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

app.get("/notes", verify, async (req, res) => {
  const userid = req.user.id;
  const notes = await fetchAll(appDB, `SELECT * FROM notes WHERE user_id = ?`, [userid])
  return res.json({notes}) // Returns notes to user
});

app.post("/notes", verify, async (req, res) => {
    const { title, text } = req.body;
    const userid = req.user.id;
    const sql = `INSERT INTO notes(user_id, title, text) VALUES(?, ?, ?)`;
  try {
    const note = await execute(appDB, sql, [userid, title, text]);
    res.json({note, success: true})
  } catch (err) {
    console.log(err);
    res.status(500).json({success: false, message: "Error creating notes"})
  } 
});


app.get("/products", async (req, res) => {
  try {
    const products = await fetchAll(appDB, "SELECT * FROM products");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});
app.get("/products/:productId", async (req, res) => {
  const rows = await fetchAll(
    appDB,
    "SELECT * FROM products WHERE productId = ?",
    [req.params.productId]
  );

  res.json(rows[0]);
});

// only work for admins
app.get("/users", async (req, res) => {
    const userid = req.user.id;
    if (req.user.role !== "ADMIN") {
      return res.json({success: false})
    }
  const users = await fetchAll(appDB, `SELECT username, role FROM users`)
  return res.json({users}) // Returns notes to user
})

app.listen(4000, () => console.log("Server running on http://localhost:4000"));