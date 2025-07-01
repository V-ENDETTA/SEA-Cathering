// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET = 'rahasia-SEA'; // Harus sama dengan yang digunakan saat login

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak. Token tidak ditemukan.' });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token tidak valid.' });
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Akses hanya untuk admin.' });
  }
  next();
}

module.exports = {
  verifyToken,
  isAdmin
};
