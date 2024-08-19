const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: true,
    trim: true,
  },
  image: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  status:{
    type:String,
    enum:['pending','active','completed'],
    default:'pending'
  },
  author:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'User',
     required:true
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
