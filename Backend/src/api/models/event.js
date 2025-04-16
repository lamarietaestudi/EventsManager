const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    poster: {
      type: String,
      required: true
    },
    visitors: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user'
      }
    ],
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: true
    }
  },
  { timestamps: true }
);

const Event = mongoose.model('events', eventSchema, 'events');

module.exports = Event;
