//NOT USED 
var jwt = require('jwt-simple');
var userModel = require('../models/user');
var config = require('../config/config');

userLogin = function(req, res) {

                            userModel.findOne({
                              $and:[
                                  {'email':req.body.email },
                                  {'password':req.body.password }
                                   ]
                              }, function(err, user){

                              if(err || !user) {
                                res.status(400).json({status:'error', message: 'You are not a buddy'  });
                              }
                              else {


                                var payload = { email: user.email };
                                // encode
                                var token = jwt.encode(payload, config.secretKey);

                                // decode
                                // var decoded = jwt.decode(token, config.secretKey);
                                // console.log("this is decoded",decoded); //=> { foo: 'bar' }

                                 res.status(200).json({status:'success', message: 'Yes you are a buddy', token:token });
                               }
                              });
}


module.exports = userLogin;
