const express = require('express');
const cors = require('cors');
const indiceRoutes = require('./routes/indice.routes');
const pensumRoutes = require('./routes/pensum.routes');
const trimestreRoutes = require('./routes/trimestre.routes');
const volanteRoutes = require('./routes/volante.routes');

const app = express();

// Middlewares
app.use(cors());
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
