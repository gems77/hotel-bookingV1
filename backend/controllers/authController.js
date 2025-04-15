const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

/* Partie Register */
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, first_name, last_name, sexe, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      sexe,
      role,
    });

    return res.status(201).json({ message: "Utilisateur créé avec succès.", user });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return res.status(500).json({
      message: "Une erreur est survenue. Veuillez réessayer plus tard.",
      error: error.message,
    });
  }
};

/* Partie Login */
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    // On génère un token JWT avec une durée d'expiration de 2 heures
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    /* Redirection basée sur le rôle */
    if (user.role === "admin") {
      return res.status(200).json({
        message: "Connexion réussie. Bienvenue, admin !",
        token,
        user: { id: user.id, email: user.email, role: user.role },
        redirectTo: "/admin/dashboard",
      });
    } else if (user.role === "simple-user") {
      return res.status(200).json({
        message: "Connexion réussie. Bienvenue, utilisateur !",
        token,
        user: { id: user.id, email: user.email, role: user.role },
        redirectTo: "/profile",
      });
    }

    return res.status(403).json({ message: "Rôle invalide." });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return res.status(500).json({
      message: "Une erreur est survenue. Veuillez réessayer plus tard.",
      error: error.message,
    });
  }
};

module.exports = { register, login };