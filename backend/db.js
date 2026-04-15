import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const appDB = new sqlite3.Database(
  path.join(__dirname, "app.db")
);

console.log("Using DB at:", path.join(__dirname, "app.db"));

/* Execute */

export const execute = async (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      resolve(this);
    });
  });
};

export const fetchAll = async (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const fetchOne = async (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

appDB.serialize(() => {

  /* USERS */
  appDB.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      forename TEXT,
      surname TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',
      resetToken TEXT,
      resetTokenExpiry INTEGER
    )
  `);

  /* PRODUCTS */
  appDB.run(`
    CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price FLOAT NOT NULL DEFAULT 0,
    priceId TEXT NOT NULL,
    productId TEXT UNIQUE,
    image TEXT,
    category TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    producerId INTEGER NOT NULL,
    FOREIGN KEY (producerId) REFERENCES users(id)
  )
  `);

  /* ORDERS */
  appDB.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      deliveryMethod TEXT,
      address TEXT,
      stripeSessionId TEXT,
      total REAL,
      status TEXT DEFAULT 'paid',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  /* ORDER PRODUCTS */
  appDB.run(`
    CREATE TABLE IF NOT EXISTS orderProducts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER,
      productId TEXT,
      quantity INTEGER,
      price REAL,
      title TEXT,
      image TEXT,
      FOREIGN KEY (orderId) REFERENCES orders(id),
      FOREIGN KEY (productId) REFERENCES products(productId)
    )
  `);

  /* REPORTS */
  appDB.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      title TEXT NOT NULL,
      text TEXT NOT NULL,
      date DATETIME,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  /* CONTACT MESSAGES */
  appDB.run(`
    CREATE TABLE IF NOT EXISTS contactMessages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      text TEXT NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  appDB.run(`
    CREATE TABLE IF NOT EXISTS producerApplications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    userId INTEGER NOT NULL,
    producerName TEXT NOT NULL,
    address TEXT NOT NULL,
    description TEXT NOT NULL,
    fsaRating INTEGER,
    hygieneCertUrl TEXT,
    status TEXT DEFAULT 'PENDING',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES users(id)
)`);

});

export async function updateStock(productId, quantityChange) {
  try {

    console.log("Updating stock:", productId, quantityChange);

    const result = await execute(
      appDB,
      "UPDATE products SET stock = stock + ? WHERE productId = ?",
      [quantityChange, productId]
    );

    console.log("Rows changed:", result.changes);

    return result;

  } catch (err) {
    console.error("UPDATE STOCK ERROR:", err);
    throw err;
  }
}

export const checkAvailability = async (productId) => {
  const sql = `SELECT stock FROM products WHERE productId = ?`;
  const result = await fetchOne(appDB, sql, [productId]);
  return result ? result.stock : 0;
};