const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');
const { createHotelValidator } = require('../validators/hotelValidator');
const { validationResult } = require('express-validator');

router.post(
  '/',
  authenticate,
  checkRole('admin'),
  createHotelValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  hotelController.createHotel
);

router.get('/', hotelController.getAllHotels);

router.get('/:id', hotelController.getHotelById);

router.put(
  '/:id',
  authenticate,
  checkRole('admin'),
  createHotelValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  hotelController.updateHotel
);

router.delete('/:id', authenticate, checkRole('admin'), hotelController.deleteHotel);

module.exports = router;