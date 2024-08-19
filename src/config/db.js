 
const mongoose = require('mongoose');
const { mongoDbUrl } = require('../secret');

const connectDB = async (options = {}) => {
    try {
        if (!mongoDbUrl) {
            throw new Error('MongoDB URL is not defined in secret.js');
        }

        await mongoose.connect(mongoDbUrl, options);
        console.log('Connection Successful');

        mongoose.connection.on('error', (error) => {
            console.error('DB Connection error:', error);
        });
    } catch (error) {
        console.error('Could not connect to DB:', error.toString());
    }
};

module.exports = connectDB;
