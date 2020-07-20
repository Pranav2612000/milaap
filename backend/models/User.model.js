const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = mongoose.model('users', new Schema({}, { strict: false }));
module.exports = users;
