const { Hotel, HotelImage } = require('../models');

module.exports = {
  /* Création d'un hotel */
  async createHotel(req, res) {
    try {
      const hotel = await Hotel.create(req.body);
      res.status(201).json({ message: 'Hôtel créé avec succès.', hotel });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la création de l\'hôtel.' });
    }
  },

  /* Listing des hotels */
  async getAllHotels(req, res) {
    try {
      const hotels = await Hotel.findAll({
        include: ['rooms', 'images', 'reviews']
      });
      res.status(200).json(hotels);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération des hôtels.' });
    }
  },

  /* Affichage d'un hotel spécifique */
  async getHotelById(req, res) {
    try {
      const hotel = await Hotel.findByPk(req.params.id, {
        include: ['rooms', 'images', 'reviews']
      });
      if (!hotel) return res.status(404).json({ message: 'Hôtel non trouvé.' });
      res.status(200).json(hotel);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'hôtel.' });
    }
  },

  /* Mise à jour d'un hôtel */
  async updateHotel(req, res) {
    try {
      const hotel = await Hotel.findByPk(req.params.id);
      if (!hotel) return res.status(404).json({ message: 'Hôtel non trouvé.' });

      await hotel.update(req.body);
      res.status(200).json({ message: 'Hôtel mis à jour avec succès.', hotel });
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'hôtel.' });
    }
  },

  /* Suppression d'un hôtel */
  async deleteHotel(req, res) {
    try {
      const hotel = await Hotel.findByPk(req.params.id);
      if (!hotel) return res.status(404).json({ message: 'Hôtel non trouvé.' });

      await hotel.destroy();
      res.status(200).json({ message: 'Hôtel supprimé avec succès.' });
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'hôtel.' });
    }
  }
};