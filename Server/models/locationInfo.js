var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationInfo =  new Schema({
State: String
});

module.exports = mongoose.model('locationInfo', locationInfo);
