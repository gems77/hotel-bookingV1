// user.routes.js
const { Router } = require('express');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

const router = Router();

router.get("/user/profile", authenticate, checkRole("simple-user"), (req, res) => {
  res.json({
    message: "Bienvenue sur votre profil utilisateur !",
    user: req.user,
  });
});

module.exports = router;