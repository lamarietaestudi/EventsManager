require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const { connectCloudinary } = require('./src/config/cloudinary');
const eventsRoute = require('./src/api/routes/events');
const usersRoute = require('./src/api/routes/users');

const app = express();
app.use(express.json());
app.use(cors());

connectDB();
connectCloudinary();

app.use('/api/v1/events', eventsRoute);
app.use('/api/v1/users', usersRoute);

app.use('*', (req, res, next) => {
  return res.status(404).json({ message: 'Route Not Found' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
