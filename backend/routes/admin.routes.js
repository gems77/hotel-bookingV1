const { Router } = require('express');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');
const { User, Hotel, Booking } = require('../models');

const router = Router();

router.get("/admin/dashboard", authenticate, checkRole("admin"), async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalAdmins = await User.count({ where: { role: "admin" } });
    const totalClients = await User.count({ where: { role: "simple-user" } });

    const totalHotels = await Hotel.count();
    const totalBookings = await Booking.count();

    const recentBookings = await Booking.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      include: [{ model: User, attributes: ['first_name', 'last_name'] }],
    });

    return res.json({
      message: "Bienvenue sur le tableau de bord de l'admin !",
      user: req.user,
      stats: {
        utilisateurs: {
          total: totalUsers,
          admins: totalAdmins,
          clients: totalClients,
        },
        hotels: totalHotels,
        reservations: totalBookings,
        recentes: recentBookings
      }
    });
  } catch (error) {
    console.error("Erreur dans le dashboard admin :", error);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des statistiques.",
      error: error.message,
    });
  }
});

module.exports = router;