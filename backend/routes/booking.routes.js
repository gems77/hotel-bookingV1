const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

router.post('/booking', authenticate, bookingController.createBooking);
router.get('/booking', authenticate, checkRole('admin'), bookingController.getAllBookings);
router.get('/booking/:id', authenticate, bookingController.getBookingById);
router.put('/booking/:id', authenticate, bookingController.updateBooking);
router.delete('/booking/:id', authenticate, bookingController.deleteBooking);

module.exports = router;