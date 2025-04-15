require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import des routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const bookingRoutes = require("./routes/booking.routes");
const roomRoutes = require("./routes/room.routes");
const hotelRoutes = require("./routes/hotel.routes");
const roomTypeRoutes = require("./routes/roomType.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/bookings', bookingRoutes);
app.use('/rooms', roomRoutes);
app.use('/hotels', hotelRoutes);
app.use('/room-types', roomTypeRoutes);

const PORT = process.env.PORT || 5000;

/* Teste de la connexion à la database et démarrage du serveur */
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie.');
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Échec de connexion à la base de données :', err);
  });