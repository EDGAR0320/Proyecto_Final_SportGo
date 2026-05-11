const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors({ origin: 'http://localhost:5173' })); // Puerto de Vite
app.use(express.json());

// Rutas
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '🚀 SportGo API corriendo', version: '1.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});