const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var users = mongoose.model('users', new Schema({}, { strict: false }));
module.exports = users;
