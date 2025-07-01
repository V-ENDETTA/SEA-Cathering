const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./models/db');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'rahasia-sea-catering';

app.use(cors());
app.use(bodyParser.json());

function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token diperlukan' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token tidak valid' });
    req.user = decoded;
    next();
  });
}

function authorizeAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Akses admin diperlukan' });
  next();
}

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400).json({ error: 'Semua field wajib diisi.' });
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!strongPassword.test(password)) return res.status(400).json({ error: 'Password lemah.' });

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Gagal memeriksa email.' });
    if (user) return res.status(409).json({ error: 'Email sudah terdaftar.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword], function (err) {
      if (err) return res.status(500).json({ error: 'Gagal menyimpan pengguna.' });
      res.status(201).json({ message: 'Registrasi berhasil', userId: this.lastID });
    });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email dan password wajib.' });

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Email tidak ditemukan.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Password salah.' });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
    res.status(200).json({ message: 'Login berhasil', token });
  });
});

app.post('/api/subscribe', authenticateUser, (req, res) => {
  const { name, phone, plan, meal_types, delivery_days, allergies, total_price } = req.body;

  const query = `INSERT INTO subscriptions (user_id, name, phone, plan, meal_types, delivery_days, allergies, total_price, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'))`;
  db.run(query, [req.user.id, name, phone, plan, meal_types.join(','), delivery_days.join(','), allergies || '', total_price], function (err) {
    if (err) return res.status(500).json({ error: 'Gagal menyimpan data langganan.' });
    res.status(200).json({ message: 'Berhasil disimpan', id: this.lastID });
  });
});

app.post('/api/testimonials', authenticateUser, (req, res) => {
  const { customer_name, message, rating } = req.body;
  const query = `INSERT INTO testimonials (customer_name, message, rating) VALUES (?, ?, ?)`;
  db.run(query, [customer_name, message, rating], function (err) {
    if (err) return res.status(500).json({ error: 'Gagal menyimpan testimoni.' });
    res.status(200).json({ message: 'Testimoni berhasil disimpan' });
  });
});

app.get('/api/testimonials', (req, res) => {
  db.all(`SELECT * FROM testimonials ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Gagal mengambil testimoni' });
    res.status(200).json(rows);
  });
});

app.get('/api/user/subscriptions', authenticateUser, (req, res) => {
  db.all(`SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active'`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Gagal mengambil data.' });
    res.status(200).json(rows);
  });
});

app.put('/api/user/subscriptions/:id/pause', authenticateUser, (req, res) => {
  const { pause_start, pause_end } = req.body;
  db.run(`UPDATE subscriptions SET pause_start = ?, pause_end = ?, status = 'paused' WHERE id = ? AND user_id = ?`,
    [pause_start, pause_end, req.params.id, req.user.id], function (err) {
      if (err) return res.status(500).json({ error: 'Gagal pause' });
      res.json({ message: 'Subscription dijeda' });
    });
});

app.put('/api/user/subscriptions/:id/cancel', authenticateUser, (req, res) => {
  db.run(`UPDATE subscriptions SET status = 'canceled', canceled_at = datetime('now') WHERE id = ? AND user_id = ?`,
    [req.params.id, req.user.id], function (err) {
      if (err) return res.status(500).json({ error: 'Gagal cancel' });
      res.json({ message: 'Subscription dibatalkan' });
    });
});

app.get('/api/admin/stats/new-subscriptions', authenticateUser, authorizeAdmin, (req, res) => {
  const { start, end } = req.query;
  db.get(`SELECT COUNT(*) as count FROM subscriptions WHERE created_at BETWEEN ? AND ?`, [start, end], (err, row) => {
    if (err) return res.status(500).json({ error: 'Gagal ambil data' });
    res.json({ newSubscriptions: row.count });
  });
});

app.get('/api/admin/stats/mrr', authenticateUser, authorizeAdmin, (req, res) => {
  const { start, end } = req.query;
  db.get(`SELECT SUM(total_price) as total FROM subscriptions WHERE status = 'active' AND created_at BETWEEN ? AND ?`, [start, end], (err, row) => {
    if (err) return res.status(500).json({ error: 'Gagal ambil MRR' });
    res.json({ mrr: row.total || 0 });
  });
});

app.get('/api/admin/stats/reactivations', authenticateUser, authorizeAdmin, (req, res) => {
  const { start, end } = req.query;
  db.get(`SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active' AND canceled_at IS NOT NULL AND created_at BETWEEN ? AND ?`, [start, end], (err, row) => {
    if (err) return res.status(500).json({ error: 'Gagal ambil reaktivasi' });
    res.json({ reactivations: row.count });
  });
});

app.get('/api/admin/stats/growth', authenticateUser, authorizeAdmin, (req, res) => {
  db.get(`SELECT COUNT(*) as total FROM subscriptions WHERE status = 'active'`, (err, row) => {
    if (err) return res.status(500).json({ error: 'Gagal ambil growth' });
    res.json({ activeSubscriptions: row.total });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});