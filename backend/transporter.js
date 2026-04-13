const nodemailer = require("nodemailer");

const isProd = process.env.NODE_ENV === "production";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: isProd ? 587 : 587, 
  secure: false,        
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: isProd
      ? process.env.GMAIL_APP_PASSWORD 
      : process.env.EMAIL_PASS       
  },
  tls: {
    rejectUnauthorized: isProd,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,        
  family: 4                     
});

// Verify connection
transporter.verify((err, success) => {
  if (err) console.error("SMTP verification failed:", err);
  else console.log("SMTP server ready");
});

module.exports = transporter;