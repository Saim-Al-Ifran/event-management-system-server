const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (value) {
          return /^\d{11}$/.test(value);
        },
        message: 'Phone number must be exactly 11 digits',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
        },
        message: 'Invalid email address',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
    },
    image: {
      type: String,
      default:'/default/image/path.jpg'
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super-admin'],
      default: 'user',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  });

  const User = mongoose.model('User',userSchema);

  module.exports = User;