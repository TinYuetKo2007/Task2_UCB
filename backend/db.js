import sqlite3 from "sqlite3";
export const appDB = new sqlite3.Database("./app.db");

export const execute = async (db, sql, params = []) => {
  if (params && params.length > 0) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

appDB.serialize(() => {
    // Users
    appDB.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        forename TEXT,
        surname TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
        )
    `);
    // Products
    appDB.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price FLOAT NOT NULL DEFAULT 0,
        priceId TEXT NOT NULL,
        productId TEXT UNIQUE,
        image TEXT,
        category TEXT NOT NULL
      )
    `);
      appDB.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        type TEXT,
        priceId TEXT NOT NULL,
        productId TEXT UNIQUE,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(productId)
      )
    `);
          appDB.run(`
      CREATE TABLE IF NOT EXISTS orderProduct (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER,
        productId TEXT UNIQUE,
        FOREIGN KEY (orderId) REFERENCES orders(id),
        FOREIGN KEY (productId) REFERENCES products(productId)
      )
    `);
    appDB.run(`
        CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        date DATETIME,
        FOREIGN KEY (userId) REFERENCES users(id)
        )`)

    appDB.run(`CREATE TABLE IF NOT EXISTS calculations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carType TEXT,
        milesPerWeek INTEGER,
        busRides INTEGER,
        trainRides INTEGER,
        tramRides INTEGER,
        electricBill INTEGER,
        gasBill INTEGER,
        totalFootprint REAL
        )`);
});
export const fetchAll = async (db, sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}; // Makes it look a like a promise-based async func