require('dotenv').config();
const express = require('express');
const cors = require('cors');
app.use(cors());
const mysql = require('mysql2');
const tartanRoutes = require('./routes/tartans');

const app = express();
const port = process.env.PORT || 3000;

// Create MySQL connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(express.json());

// Routes
app.use('/tartans', tartanRoutes(db));

// Start server
app.listen(port, () => {
    console.log(`Tartan API running at http://localhost:${port}`);
});
