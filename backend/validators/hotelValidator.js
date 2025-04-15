const { body } = require('express-validator');

module.exports = {
  createHotelValidator: [
    body('name').notEmpty().withMessage('Le nom de l\'hôtel est requis.'),
    body('description').notEmpty().withMessage('La description de l\'hôtel est requise.'),
    body('address').notEmpty().withMessage('L\'adresse de l\'hôtel est requise.'),
    body('city').notEmpty().withMessage('La ville est requise.'),
    body('country').notEmpty().withMessage('Le pays est requis.'),
    body('star_rating').isInt({ min: 1, max: 5 }).withMessage('La note doit être comprise entre 1 et 5.'),
    body('has_wifi').isBoolean().withMessage('Le champ Wi-Fi doit être un booléen.'),
    body('has_pool').isBoolean().withMessage('Le champ piscine doit être un booléen.'),
    body('has_restaurant').isBoolean().withMessage('Le champ restaurant doit être un booléen.'),
    body('has_parking').isBoolean().withMessage('Le champ parking doit être un booléen.'),
    body('has_gym').isBoolean().withMessage('Le champ salle de sport doit être un booléen.')
  ]
};