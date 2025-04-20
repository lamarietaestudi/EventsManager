const Event = require('../models/event.js');
const User = require('../models/user.js');
const cloudinary = require('../../config/cloudinary.js');
const multer = require('multer');
const upload = require('../../middlewares/files.js');
const {
  deleteCloudinaryImage
} = require('../../utils/deleteCloudinaryImage.js');

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    return res.status(200).json(events);
  } catch (error) {
    return res.status(400).json({ message: 'Error al obtener eventos', error });
  }
};

const getEventsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    return res.status(200).json(event);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Error al obtener el evento', error });
  }
};

const getMyEvents = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('publishedEvents');
    if (user) {
      return res.status(200).json(user.publishedEvents);
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Error al obtener tus eventos', error });
  }
};

const postEvent = async (req, res, next) => {
  try {
    const newEvent = new Event({ ...req.body, creator: req.user._id });
    if (req.file) {
      newEvent.poster = req.file.path;
    }
    const eventSaved = await newEvent.save();

    const user = await User.findById(req.user._id);
    if (user) {
      user.publishedEvents.push(eventSaved._id);
      await user.save();
    }
    return res.status(201).json(eventSaved);
  } catch (error) {
    console.error('Error al subir la imagen o al guardar el evento', error);
    return res.status(500).json({ message: 'Error al crear el evento', error });
  }
};

const getMyVisitors = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).populate('visitors', 'email');
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    const validVisitors = event.visitors.filter((visitor) => visitor !== null);
    return res.status(200).json(validVisitors);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error al obtener visitantes', error });
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {};
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    if (event.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para modificar este evento' });
    }

    if (req.body.title) {
      updateData.title = req.body.title;
    }
    if (req.body.location) {
      updateData.location = req.body.location;
    }
    if (req.body.description) {
      updateData.description = req.body.description;
    }

    if (req.file) {
      if (event.poster) {
        await deleteCloudinaryImage(event.poster);
      }
      updateData.poster = req.file.path;
    }

    if (Object.keys(updateData).length > 0) {
      const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });
      return res.status(200).json(updatedEvent);
    } else {
      return res.status(200).json(event);
    }
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res
      .status(500)
      .json({ message: 'Error al actualizar el evento', error: error.message });
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const eventDeleted = await Event.findByIdAndDelete(id);

    if (eventDeleted) {
      await User.findByIdAndUpdate(eventDeleted.creator, {
        $pull: { publishedEvents: id }
      });

      if (eventDeleted.poster) {
        await deleteCloudinaryImage(eventDeleted.poster);
      }
      return res
        .status(200)
        .json({ mensaje: 'Este evento ha sido eliminado', eventDeleted });
    } else {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getEvents,
  getEventsById,
  getMyEvents,
  getMyVisitors,
  postEvent,
  updateEvent,
  deleteEvent
};
