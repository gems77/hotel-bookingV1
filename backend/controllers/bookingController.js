const { Booking, Room, User } = require('../models');
const { Op } = require('sequelize');

/* Création d'une réservation */
exports.createBooking = async (req, res) => {
  try {
    const { room_id, check_in_date, check_out_date, adults, children } = req.body;

    const room = await Room.findByPk(room_id);
    if (!room) return res.status(404).json({ message: "Chambre introuvable." });

    const startDate = new Date(check_in_date);
    const endDate = new Date(check_out_date);

    if (startDate >= endDate) {
      return res.status(400).json({ message: "Les dates sont invalides." });
    }

    const overlapping = await Booking.findOne({
      where: {
        room_id,
        [Op.or]: [
          {
            check_in_date: { [Op.lt]: endDate },
            check_out_date: { [Op.gt]: startDate }
          }
        ],
        status: { [Op.in]: ['pending', 'confirmed'] }
      }
    });

    if (overlapping) {
      return res.status(409).json({ message: "Chambre déjà réservée pour ces dates." });
    }

    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const total_price = duration * parseFloat(room.price_per_night);

    const booking = await Booking.create({
      user_id: req.user.id,
      room_id,
      check_in_date,
      check_out_date,
      adults,
      children,
      total_price
    });

    return res.status(201).json({ message: "Réservation créée avec succès", booking });
  } catch (error) {
    console.error("Erreur création :", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* Listing de toutes les réservations */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: ['user', 'room'],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* Récupération d'une réservation spécifique */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: ['user', 'room']
    });

    if (!booking) return res.status(404).json({ message: "Réservation introuvable" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* Mise à jour d'une réservation */
exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { room_id, check_in_date, check_out_date, adults, children } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: "Réservation non trouvée" });

    if (['confirmed', 'cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ message: "Modification non autorisée pour cet état." });
    }

    const room = await Room.findByPk(room_id || booking.room_id);
    if (!room) return res.status(404).json({ message: "Chambre introuvable." });

    const startDate = new Date(check_in_date || booking.check_in_date);
    const endDate = new Date(check_out_date || booking.check_out_date);
    if (startDate >= endDate) {
      return res.status(400).json({ message: "Les dates sont invalides." });
    }

    const overlapping = await Booking.findOne({
      where: {
        id: { [Op.ne]: bookingId },
        room_id: room_id || booking.room_id,
        [Op.or]: [
          {
            check_in_date: { [Op.lt]: endDate },
            check_out_date: { [Op.gt]: startDate }
          }
        ],
        status: { [Op.in]: ['pending', 'confirmed'] }
      }
    });

    if (overlapping) {
      return res.status(409).json({ message: "Conflit de réservation détecté." });
    }

    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const total_price = duration * parseFloat(room.price_per_night);

    await booking.update({
      room_id: room_id || booking.room_id,
      check_in_date: startDate,
      check_out_date: endDate,
      adults: adults ?? booking.adults,
      children: children ?? booking.children,
      total_price
    });

    res.status(200).json({ message: "Réservation mise à jour", booking });
  } catch (error) {
    console.error("Erreur update :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* Suppression d'une réservation */
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Réservation introuvable" });

    await booking.destroy();
    res.status(200).json({ message: "Réservation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};