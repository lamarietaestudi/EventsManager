const { verifyToken } = require('../utils/jwt');
const User = require('../api/models/user');

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'No estás autorizado.' });
    }

    const parsedToken = token.replace('Bearer ', '');
    const { id } = verifyToken(parsedToken);
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    user.password = null;
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'No estás autorizado.' });
  }
};

module.exports = { isAuth };
