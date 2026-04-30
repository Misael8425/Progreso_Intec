const express = require('express');
const cors = require('cors');
const indiceRoutes = require('./routes/indice.routes');
const pensumRoutes = require('./routes/pensum.routes');
const trimestreRoutes = require('./routes/trimestre.routes');
const volanteRoutes = require('./routes/volante.routes');

const app = express();

// Middlewares
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://progresointec.netlify.app'] // URL de Netlify
  : ['http://localhost:5173', 'http://127.0.0.1:5173']; // URLs de Vite local

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
}));
app.use(express.json());

// Rutas base
app.use('/api', indiceRoutes);
app.use('/api', pensumRoutes);
app.use('/api', trimestreRoutes);
app.use('/api', volanteRoutes);

// Ruta de prueba
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong!' });
});

module.exports = app;
