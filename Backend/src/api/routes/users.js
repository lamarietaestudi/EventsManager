const usersRoute = require('express').Router();
const { isAuth } = require('../../middlewares/auth');
const {
  getUsers,
  getUserById,
  getMyConfirmations,
  loginOrRegister,
  updateUser,
  deleteUser,
  addFavoriteEvent,
  removeFavoriteEvent,
  confirmAssistant,
  cancelAssistant
} = require('../controllers/users');

usersRoute.get('/', getUsers);
usersRoute.get('/:id', getUserById);
usersRoute.get('/confirmations/:userId', isAuth, getMyConfirmations);
usersRoute.post('/auth', loginOrRegister);
usersRoute.put('/:id', isAuth, updateUser);
usersRoute.delete('/:id', deleteUser);
usersRoute.put('/:userId/favorites/:eventId', isAuth, addFavoriteEvent);
usersRoute.put(
  '/confirm-assistance/:userId/:eventId',
  isAuth,
  confirmAssistant
);
usersRoute.delete('/:userId/favorites/:eventId', isAuth, removeFavoriteEvent);
usersRoute.delete(
  '/cancel-assistance/:userId/:eventId',
  isAuth,
  cancelAssistant
);

module.exports = usersRoute;
