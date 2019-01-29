var locationModel =  require('../models/locationInfo');

var States = {
                  // get states from locationinfos collection
                  getStates: function(req, res) {

                            locationModel.find(function(err, docs){
                            if(err) {
                              res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
                            }
                            else {
                              res.status(200).json({status:'success', message: 'Success', docs: docs });
                            }
                            });

                }
              };
module.exports = States;
