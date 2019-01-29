var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userInfo =  new Schema({
  FirstName: String,
  LastName: String,
  BirthDate:String,
  Gender : {type: String, enum: ['Male','Female']},
  Hobbies:  {type: [String], enum: ['Cricket','Dancing','Singing','Acting']},
  PhoneNo:String,
  Address:String,
  City:String,
  State:String,
  Zipcode:String,
  Email:String,
  Username:String,
  Password:String,
  ProfilePicture:String
});

module.exports = mongoose.model('userInfo', userInfo);
