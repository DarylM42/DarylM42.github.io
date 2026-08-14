const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    hash: { type: String, required: true }
});

userSchema.methods.setPassword = async function(password) {
    this.hash = await bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = async function(password) {
    return bcrypt.compare(password, this.hash);
};

module.exports = mongoose.model('User', userSchema);
