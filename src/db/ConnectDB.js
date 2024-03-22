const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.DB_URI;

const ConnectDB = async () => {
    try {
        await mongoose.connect(uri, { dbName: 'ProjectDB' });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect database:', error);
        process.exit(1); // Exit with failure
    }
}

module.exports = ConnectDB;
