const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '12345',
  port: 5432,
});

// GET products
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST product
app.post('/products', async (req, res) => {
  const { name_en, name_fr, name_es, price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name_en, name_fr, name_es, price) VALUES ($1,$2,$3,$4) RETURNING *',
      [name_en, name_fr, name_es, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('API running on http://192.168.0.108:3000');
});

