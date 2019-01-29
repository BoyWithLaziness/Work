var express = require('express');
var router = express.Router();
var moment =  require('moment');
var multer = require('multer');
var users = require('./controllers/usersInfo');
var loc = require('./controllers/GetLocationData')
var moment = require('moment');
var momentObj = moment(new Date);
var dateStr = momentObj.format("MMM Do YY").split(' ').join('-');
var config = require('./config/config');


//file upload options
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("this is the ,multer path");
    console.log(config.path);
    cb(null, config.path)
  },
  filename: function (req, file, cb) {
    cb(null, dateStr+"-"+file.originalname) //Appending .jpg
  }
})

//uploading file with this
var upload = multer({storage:storage});


console.log("inside----------ROUTES------");
//all post requests
router.post('/job_portal/login',users.checkCredentials)
router.post('/job_portal/send_mail',users.sendMail)
router.post('/job_portal/is_unique/',users.isUnique)
router.post('/job_portal/create_state/',users.create_state);
router.post('/job_portal/create_user/',users.create);
router.post('/job_portal/set_password/',users.setPassword);
router.post('/job_portal/image_criteria_check/',users.checkFileCriteria);
//file upload done here
router.post('/job_portal/upload/',upload.single('file'),users.upload);
router.post('/job_portal/get_user',users.getUser)

//all get requests
router.get('/job_portal/show/',users.show);
router.get('/job_portal/show_states/',loc.getStates);
router.get('/job_portal/get_users/',users.getUsers);
router.get('/job_portal/get_photos',users.getPhotos)
router.get('/job_portal/user_logout/',users.logout)
router.get('/job_portal/check_login/',users.checkLogin)
module.exports = router;
