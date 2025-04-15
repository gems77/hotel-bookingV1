const { body } = require('express-validator');

module.exports = {
  createRoomValidator: [
    body('hotel_id').notEmpty().withMessage('L\'hôtel est requis.'),
    body('room_type_id').notEmpty().withMessage('Le type de chambre est requis.'),
    body('room_number').notEmpty().withMessage('Le numéro de chambre est requis.'),
    body('floor').isInt().withMessage('L\'étage doit être un nombre.'),
  ]
};