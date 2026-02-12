// server.js
const express = require("express");
const { Client } = require("pg");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL database
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

client.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Connection error", err.stack));

// Routes

// Example route for fetching all services
app.get("/api/services", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM services");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example route for booking a service
app.post("/api/book-service", async (req, res) => {
  const { bikeModel, serviceType, customerName, contactNumber, date } = req.body;

  try {
    const result = await client.query(
      "INSERT INTO bookings (bike_model, service_type, customer_name, contact_number, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [bikeModel, serviceType, customerName, contactNumber, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
