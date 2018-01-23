var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shorterSchema = new Schema({
    url: String,
    short: String,
})

module.exports = mongoose.model('short', shorterSchema);