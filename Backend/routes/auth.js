const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
require('dotenv').config();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos.' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user)
    return res.status(401).json({ error: 'Credenciales incorrectas.' });

  if (user.estado === 'inactivo')
    return res.status(403).json({ error: 'Cuenta inactiva. Contacta al administrador.' });

  const passwordOk = bcrypt.compareSync(password, user.password);
  if (!passwordOk)
    return res.status(401).json({ error: 'Credenciales incorrectas.' });

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol, nombre: user.nombre },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  // Redireccion segun rol
  const redirects = {
    admin:        '/dashboard/admin',
    propietario:  '/dashboard/propietario',
    arrendatario: '/dashboard/arrendatario',
  };

  res.json({
    mensaje: 'Login exitoso',
    token,
    rol: user.rol,
    nombre: user.nombre,
    redirect: redirects[user.rol]
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { nombre, apellido, email, password, telefono, rol } = req.body;

  if (!nombre || !apellido || !email || !password)
    return res.status(400).json({ error: 'Campos obligatorios incompletos.' });

  const existe = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existe)
    return res.status(409).json({ error: 'El email ya está registrado.' });

  const hash = bcrypt.hashSync(password, 10);
  const rolFinal = rol || 'arrendatario';

  const result = db.prepare(`
    INSERT INTO users (nombre, apellido, email, password, telefono, rol)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(nombre, apellido, email, hash, telefono || null, rolFinal);

  res.status(201).json({ mensaje: 'Usuario registrado exitosamente.', id: result.lastInsertRowid });
});

module.exports = router;