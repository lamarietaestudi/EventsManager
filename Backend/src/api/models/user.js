const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    rol: {
      type: String,
      default: 'user',
      enum: ['admin', 'user']
    },
    favoriteEvents: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'events'
      }
    ],
    publishedEvents: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'events'
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10);
});

const User = mongoose.model('user', userSchema);

module.exports = User;
