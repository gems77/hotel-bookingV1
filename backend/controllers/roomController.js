const { Room, RoomType, Hotel } = require('../models');

module.exports = {
  async createRoom(req, res) {
    try {
      const room = await Room.create(req.body);
      res.status(201).json({ message: 'Chambre créée avec succès.', room });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la création de la chambre.' });
    }
  },

  async getAllRooms(req, res) {
    try {
      const rooms = await Room.findAll({
        include: ['room_type', 'hotel']
      });
      res.status(200).json(rooms);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération des chambres.' });
    }
  },

  async getRoomById(req, res) {
    try {
      const room = await Room.findByPk(req.params.id, {
        include: ['room_type', 'hotel']
      });
      if (!room) return res.status(404).json({ message: 'Chambre non trouvée.' });
      res.status(200).json(room);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération de la chambre.' });
    }
  },

  async updateRoom(req, res) {
    try {
      const room = await Room.findByPk(req.params.id);
      if (!room) return res.status(404).json({ message: 'Chambre non trouvée.' });

      await room.update(req.body);
      res.status(200).json({ message: 'Chambre mise à jour avec succès.', room });
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la chambre.' });
    }
  },

  async deleteRoom(req, res) {
    try {
      const room = await Room.findByPk(req.params.id);
      if (!room) return res.status(404).json({ message: 'Chambre non trouvée.' });

      await room.destroy();
      res.status(200).json({ message: 'Chambre supprimée avec succès.' });
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la suppression de la chambre.' });
    }
  }
};