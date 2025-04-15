const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');
const { createRoomValidator } = require('../validators/roomValidator');
const { validationResult } = require('express-validator');

/* Craetion  d'une chambre */
router.post(
  '/',
  authenticate,
  checkRole('admin'),
  createRoomValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  roomController.createRoom
);

/* Listing de toutes les chambres */
router.get('/', roomController.getAllRooms);

/* Récupération d'une chambre spécifique */
router.get('/:id', roomController.getRoomById);

/* Mise à jour d'une chambre */
router.put(
  '/:id',
  authenticate,
  checkRole('admin'),
  createRoomValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  roomController.updateRoom
);

/* Suppression d'une chambre */
router.delete('/:id', authenticate, checkRole('admin'), roomController.deleteRoom);

module.exports = router;