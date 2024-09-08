const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  siteName: { 
    type: String,
    required: true
  },
  siteLogo: {
    type: String,
    required: true
  },
  footerDescription: {
    type: String,
    required: true
  },
  socialLinks: {
    facebook: {
      type: String,
      required:true
    },
    twitter: {
      type: String,
      required: true
    },
    instagram: {
      type: String,
      required: true
    }
  }
});

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
