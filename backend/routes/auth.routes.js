// auth.routes.js
const { Router } = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = Router();

/* Validations pour la partie register */
const registerValidation = [
  body("email").isEmail().withMessage("L'email n'est admin/dashboardpas valide"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères"),
  body("first_name").notEmpty().withMessage("Le prénom est requis"),
  body("last_name").notEmpty().withMessage("Le nom est requis"),
  body("sexe")
    .isIn(["Masculin", "Féminin"])
    .withMessage("Le sexe doit être 'Masculin' ou 'Féminin'"),
  body("role")
    .isIn(["admin", "simple-user"])
    .withMessage("Le rôle doit être 'admin' ou 'simple-user'"),
];

/* Validations pour la partie login */
const loginValidation = [
  body("email").isEmail().withMessage("L'email est invalide"),
  body("password").notEmpty().withMessage("Le mot de passe est requis"),
];

router.post("/register", registerValidation, register);

router.post("/login", loginValidation, login);

module.exports = router;