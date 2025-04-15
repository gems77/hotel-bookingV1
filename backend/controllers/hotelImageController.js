const { HotelImage } = require('../models');

module.exports = {
  async addHotelImage(req, res) {
    try {
      const { hotel_id, image_url, is_primary } = req.body;
      const hotelImage = await HotelImage.create({ hotel_id, image_url, is_primary });
      res.status(201).json({ message: "Image ajoutée avec succès.", hotelImage });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de l'ajout de l'image." });
    }
  },

  async getHotelImages(req, res) {
    try {
      const images = await HotelImage.findAll({ where: { hotel_id: req.params.hotelId } });
      res.status(200).json(images);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des images." });
    }
  }
};