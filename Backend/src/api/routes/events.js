const eventsRoute = require('express').Router();
const upload = require('../../middlewares/files');
const { isAuth } = require('../../middlewares/auth');
const {
  getEvents,
  getEventsById,
  getMyEvents,
  getMyVisitors,
  postEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/events');

eventsRoute.get('/', getEvents);
eventsRoute.get('/:id', getEventsById);
eventsRoute.get('/me/events', isAuth, getMyEvents);
eventsRoute.get('/visitors/:eventId', isAuth, getMyVisitors);
eventsRoute.post('/', isAuth, upload.single('poster'), postEvent);
eventsRoute.put('/:id', isAuth, upload.single('poster'), updateEvent);
eventsRoute.delete('/:id', isAuth, deleteEvent);

module.exports = eventsRoute;
