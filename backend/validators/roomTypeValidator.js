const { body } = require('express-validator');

module.exports = {
  createRoomTypeValidator: [
    body('name').notEmpty().withMessage('Le nom du type de chambre est requis.'),
    body('description').notEmpty().withMessage('La description est requise.'),
    body('base_price').isDecimal().withMessage('Le prix de base doit être un nombre décimal.'),
    body('capacity').isInt({ min: 1 }).withMessage('La capacité doit être un nombre entier supérieur ou égal à 1.')
  ]
};