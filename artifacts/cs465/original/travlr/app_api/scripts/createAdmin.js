const mongoose = require('mongoose');
const User = require('../models/user');

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '..', '.env') });

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travlr';

mongoose.connect(dbURI);

async function createAdmin() {
    try {
        const username = process.env.ADMIN_USERNAME || 'admin';
        const password = process.env.ADMIN_PASSWORD || 'admin123';

        const user = new User({ username, role: 'admin' });
        await user.setPassword(password);
        await user.save();
        console.log('Admin user created successfully');
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

createAdmin();
