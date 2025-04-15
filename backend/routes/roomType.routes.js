const express = require('express');
const router = express.Router();
const roomTypeController = require('../controllers/roomTypeController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');
const { createRoomTypeValidator } = require('../validators/roomTypeValidator');
const { validationResult } = require('express-validator');

router.post(
  '/',
  authenticate, 
  checkRole('admin'), 
  createRoomTypeValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  roomTypeController.createRoomType
);

router.get('/', roomTypeController.getAllRoomTypes);

router.get('/:id', roomTypeController.getRoomTypeById);

router.put(
  '/:id', 
  authenticate, 
  checkRole('admin'), 
  createRoomTypeValidator, 
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  roomTypeController.updateRoomType
);

router.delete('/:id', authenticate, checkRole('admin'), roomTypeController.deleteRoomType);

module.exports = router;