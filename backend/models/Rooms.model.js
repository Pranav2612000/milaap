const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rooms = mongoose.model('rooms', new Schema({}, { strict: false }));
module.exports = rooms;
