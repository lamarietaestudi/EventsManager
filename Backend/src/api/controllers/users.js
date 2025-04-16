const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../utils/jwt');
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('favoriteEvents');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const loginOrRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).populate('favoriteEvents');

    if (user) {
      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      const token = generateToken(user._id);
      return res.status(200).json({ token, user });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        rol: 'user'
      });

      user = await newUser.save();
      const token = generateToken(user._id);
      return res.status(201).json({ token, user });
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(500).json({ message: 'Error en autenticación', error });
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() !== id) {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para realizar esta operación' });
    }
    const oldUser = await User.findById(id);

    const newFavorites = req.body.favoriteEvents || [];
    const updatedFavorites = Array.from(
      new Set([
        ...oldUser.favoriteEvents.map(String),
        ...newFavorites.map(String)
      ])
    );

    const userUpdated = await User.findByIdAndUpdate(
      id,
      { $set: { ...req.body, favoriteEvents: updatedFavorites } },
      { new: true, runValidators: true }
    ).populate('favoriteEvents');
    return res.status(200).json(userUpdated);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user._id.toString() !== id) {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para realizar esta operación' });
    }
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const addFavoriteEvent = async (req, res, next) => {
  try {
    const { userId, eventId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    if (!user.favoriteEvents.includes(eventId)) {
      user.favoriteEvents.push(eventId);
      await user.save();
    }
    const updatedUser = await User.findById(userId).populate('favoriteEvents');
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const removeFavoriteEvent = async (req, res, next) => {
  try {
    const { userId, eventId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    user.favoriteEvents = user.favoriteEvents.filter(
      (id) => id.toString() !== eventId
    );
    await user.save();
    const updatedUser = await User.findById(userId).populate('favoriteEvents');
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  loginOrRegister,
  updateUser,
  deleteUser,
  addFavoriteEvent,
  removeFavoriteEvent
};
