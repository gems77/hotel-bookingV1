const { RoomType } = require('../models');

module.exports = {
  async createRoomType(req, res) {
    try {
      const { name, description, base_price, capacity } = req.body;
      const roomType = await RoomType.create({ name, description, base_price, capacity });
      res.status(201).json({ message: 'Type de chambre créé avec succès.', roomType });
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la création du type de chambre.' });
    }
  },

  async getAllRoomTypes(req, res) {
    try {
      const roomTypes = await RoomType.findAll();
      res.status(200).json(roomTypes);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération des types de chambres.' });
    }
  },

  async getRoomTypeById(req, res) {
    try {
      const roomType = await RoomType.findByPk(req.params.id);
      if (!roomType) return res.status(404).json({ message: 'Type de chambre non trouvé.' });
      res.status(200).json(roomType);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération du type de chambre.' });
    }
  },

  async updateRoomType(req, res) {
    try {
      const roomType = await RoomType.findByPk(req.params.id);
      if (!roomType) return res.status(404).json({ message: 'Type de chambre non trouvé.' });

      await roomType.update(req.body);
      res.status(200).json({ message: 'Type de chambre mis à jour avec succès.', roomType });
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du type de chambre.' });
    }
  },

  async deleteRoomType(req, res) {
    try {
      const roomType = await RoomType.findByPk(req.params.id);
      if (!roomType) return res.status(404).json({ message: 'Type de chambre non trouvé.' });

      await roomType.destroy();
      res.status(200).json({ message: 'Type de chambre supprimé avec succès.' });
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la suppression du type de chambre.' });
    }
  }
};