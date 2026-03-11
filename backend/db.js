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
    appDB.run(`
        CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        artist_id INTEGER,
        content TEXT,
        event_date TEXT
        year INTEGER,
        FOREIGN KEY (artist_id) REFERENCES artists(id)
      )
  `);
    // Users
    appDB.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
        )
    `);
    appDB.run(`
        CREATE TABLE IF NOT EXISTS artists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      )
    `);
    // Products
    appDB.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        priceId TEXT NOT NULL,
        productId TEXT UNIQUE
      )
    `);
    appDB.run(`
        CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        date DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id)
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