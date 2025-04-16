const usersRoute = require('express').Router();
const { isAuth } = require('../../middlewares/auth');
const {
  getUsers,
  getUserById,
  loginOrRegister,
  updateUser,
  deleteUser,
  addFavoriteEvent,
  removeFavoriteEvent
} = require('../controllers/users');

usersRoute.get('/', getUsers);
usersRoute.get('/:id', getUserById);
usersRoute.post('/auth', loginOrRegister);
usersRoute.put('/:id', isAuth, updateUser);
usersRoute.delete('/:id', deleteUser);
usersRoute.put('/:userId/favorites/:eventId', isAuth, addFavoriteEvent);
usersRoute.delete('/:userId/favorites/:eventId', isAuth, removeFavoriteEvent);

module.exports = usersRoute;
