const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  siteLogo: {
    type: String, // Assuming the logo is stored as a file path or URL
  },
  siteName: {
    type: String,
  },
  siteTitle: {
    type: String,
  },
  themeColor: {
    type: String,
  },
  footerDescription: {
    type: String,
  },
  taxOnTicket: {
    type: Number,
  },
  backupAndRestore: {
    type: Boolean,
    default: false,
  },
 
  currencyOptions: {
    type: String,
  },
  siteLanguage: {
    type: String,
  },
});

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
