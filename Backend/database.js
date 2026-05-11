const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'sportgo.db'));

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    telefono TEXT,
    rol TEXT NOT NULL DEFAULT 'arrendatario' CHECK(rol IN ('admin', 'propietario', 'arrendatario')),
    estado TEXT NOT NULL DEFAULT 'activo' CHECK(estado IN ('activo', 'inactivo')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insertar usuarios de demo si la tabla está vacía
const count = db.prepare('SELECT COUNT(*) as total FROM users').get();
if (count.total === 0) {
  const bcrypt = require('bcryptjs');
  const insert = db.prepare(`
    INSERT INTO users (nombre, apellido, email, password, telefono, rol, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const usuarios = [
    ['Carlos',  'Mendoza', 'admin@sportgo.com',      bcrypt.hashSync('admin123', 10),  '+59172345678', 'admin',        'activo'],
    ['Ana',     'Garcia',  'ana@sportgo.com',         bcrypt.hashSync('ana123', 10),    '+59170234567', 'propietario',  'activo'],
    ['Luis',    'Vargas',  'luis@sportgo.com',        bcrypt.hashSync('luis123', 10),   '+59171345678', 'arrendatario', 'activo'],
    ['Sofia',   'Rios',    'sofia@sportgo.com',       bcrypt.hashSync('sofia123', 10),  '+59169876543', 'arrendatario', 'inactivo'],
  ];

  usuarios.forEach(u => insert.run(...u));
  console.log('✅ Usuarios de demo creados');
}

module.exports = db;