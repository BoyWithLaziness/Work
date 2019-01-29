var userModel =  require('../models/userInfo');
var locationModel =  require('../models/locationInfo');
var config = require('../config/config');
var CryptoJS = require("crypto-js");
var multer  = require('multer')
var fs = require('fs');
var moment = require('moment');
// var ses = require('node-ses')
//   , client = ses.createClient({ key: 'AKIAIP7ADIWKJCS5KXOA', secret: 'AryYI9O1f9jFX62AwA2mC3kWKhu2O+pjr5MY4x8EKjhv',amazon:'http://email-smtp.us-east-1.amazonaws.com' });
// var helper = require('sendgrid').mail;
// const async = require('async');
//var email 	= require("../node_modules/emailjs/email");
// var awsSesMail = require('aws-ses-mail');
// var sesMail = new awsSesMail();
// var sesConfig = {
//   accessKeyId: 'AKIAIP7ADIWKJCS5KXOA',
//   secretAccessKey: 'AryYI9O1f9jFX62AwA2mC3kWKhu2O+pjr5MY4x8EKjhv',
//   region: 'us-east-1'
// };
// sesMail.setConfig(sesConfig);
//var smtpc = require("smtpc");
// const SMTPConnection = require("../node_modules/nodemailer/lib/smtp-connection");
// let connection = new SMTPConnection(options);
// var s = require('smtp-client');
// var s = require()
var nodemailer = require('nodemailer');







//GLOBALS
var truthValueDoc = { truthValue: false }
global_path_file = null ;
global_username = null ;
global_isLogin = null;



var users  = {
  //check server working or not, get response
  show: function(req, res) {
    res.status(200).json({status:'success', message: 'Success'});
  },

  //get all users from userInfos collection in DB
  getUsers: function(req,res) {
    userModel.find(function(err, docs){
      if(err) {
        res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
      }
      else {
        res.status(200).json({status:'success', message: 'Success', docs: docs });
      }
    });

  },
  //get singler user from usersInfo collection from DB, using username
  getUser: function(req,res) {
    console.log(req.body);
    userModel.find({ "Username": req.body.username},function(err, docs){
      if(err){
        res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
      }
      else {
        console.log(docs)
        res.status(200).json({status:'success', message: 'Success', docs: docs });
      }
    });
  },

  //create user in userInfo collection in DB, with registeration data
  create: function(req, res) {

    console.log("************************************")
    console.log("this is create method");
    console.log(global_path_file);
    console.log("************************************")

    var user =  new userModel();
    user.FirstName = req.body.FirstName;
    user.LastName = req.body.LastName;
    user.BirthDate = req.body.BirthDate;
    user.Gender = req.body.Gender;
    user.Hobbies = req.body.Hobbies;
    user.PhoneNo = req.body.PhoneNo;
    user.Address = req.body.Address;
    user.City = req.body.City;
    user.State = req.body.State;
    user.Zipcode = req.body.Zipcode;
    user.Email = req.body.Email;
    user.Username = req.body.Username;
    user.Password = req.body.Password;
    user.ProfilePicture = global_path_file
    var docx = {
      FirstName : req.body.FirstName,
      LastName : req.body.LastName,
      BirthDate : req.body.BirthDate,
      Gender : req.body.Gender,
      Hobbies : req.body.Hobbies,
      PhoneNo : req.body.PhoneNo,
      Address : req.body.Address,
      City : req.body.City,
      State : req.body.State,
      Zipcode : req.body.Zipcode,
      Email : req.body.Email,
      Username: req.body.Username,
      Password : req.body.Password,
      ProfilePicture : global_path_file
    };
    config.username = docx.Username;

    user.save(function(err){
      var docs = {};
      if(err) {
        res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
      }
      else {
        res.status(200).json({status:'success', message: 'Added to Mongo successfully', docs: docx });
      }

    });
  },

  //create state in locationInfo collection
  create_state: function(req, res){
    var location =  new locationModel();
    location.State = req.body.State;
    var docx = {
      State : req.body.State,
    };
    location.save(function(err){
      var docs = {};
      if(err) {
        res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
      }
      else {
        res.status(200).json({status:'success', message: 'Added to Mongo successfully', docs: docx });
      }

    });
  },

  //Check uniqueness of username and email in userInfos, in DB
  isUnique : function(req, res) {
    userModel.find(function(err, docs){
      if(err) {
        res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
      }
      else {
        if(req.body.email != "") {
          truthValueDoc.truthValue = checkInEmailDb(req.body.email,docs)
        }
        else if(req.body.username != ""){
          truthValueDoc.truthValue = checkInUsernameDb(req.body.username,docs)
        }
        res.status(200).json({status:'success', message: 'Success', docs: truthValueDoc });
      }
    });
  },

  //check credentials from userInfos collection in DB
  //and login user if data found and create session for
  //that user with session containing login status and username
  checkCredentials: function(req, res) {
    console.log("this is inside checkCredentials js function",req.body);

    userModel.find(function(err, docs){
      if(err) {
        res.status(500).json({status:'error', message: 'Datebase Error:' + err , docs:''});
      }
      else {
        truthValueDoc.truthValue = checkCredentialsInDb(req.body,docs);
         //global_isLogin = true;
         req.session.loginStatus = truthValueDoc.truthValue;
         req.session.username =  req.body.username;
         global_isLogin = true;
         console.log("SESSION CREATED VALUE IS BELOW");
         req.session.save();
         console.log("SESSION SAVED");
         global_isLogin = true;
         console.log(req.body);
         res.status(200).json({status:'success', username: req.body.username, docs: truthValueDoc });
      }
    });

  },

  //Send email from changing password
  //Resetting password using email
  sendMail:  function(req, res) {
    // var mail = require('mail').Mail({
    //   host: 'email-smtp.us-east-1.amazonaws.com',
    //   username: 'AKIAIP7ADIWKJCS5KXOA',
    //   password: 'AryYI9O1f9jFX62AwA2mC3kWKhu2O+pjr5MY4x8EKjhv'
    // });
    //
    // mail.message({
    //   from: 'no-reply@liveexamcenter.com',
    //   to: [req.body.email],
    //   subject: 'Hello from Aditya'
    // })
    // .body('Node speaks SMTP! hurray')
    // .send(function(err) {
    //   if (err) throw err;
    //   console.log('Sent!');
    // });

    //   var server 	= email.server.connect({
    //   user:    "AKIAIP7ADIWKJCS5KXOA",
    //   password:"AryYI9O1f9jFX62AwA2mC3kWKhu2O+pjr5MY4x8EKjhv",
    //   host:    "http://email-smtp.us-east-1.amazonaws.com",
    //   ssl:     true
    // });

    // send the message and get a callback with an error or details of the message that was sent
    // server.send({
    //   text:    "i hope this works",
    //   from:    " no-reply@liveexamcenter.com",
    //   to:      req.body.email,
    //   //cc:      "else <else@your-email.com>",
    //   subject: "testing emailjs"
    // }, function(err, message) { console.log(err || message); });

    // client.sendEmail({
    //   to: req.body.email,
    //   from: 'no-reply@liveexamcenter.com',
    //   subject: 'Greetings User :)',
    //   message: 'your <b>message</b> goes here',
    //   altText: 'this is alternative text'
    //   }, function (err, data, res) {
    //     if(err){
    //       console.log(err)
    //     }
    //     else {
    //       console.log("Mail has been sent")
    //     }
    // });

    // var options = {
    //   from: 'no-reply@liveexamcenter.com',
    //   to: req.body.email,
    //   subject: 'Hello People,This Is SES, yuuuu huuuuu',
    //   content: '<html><head></head><body><div><p>Guess who\'s here </p></div></body></html>'
    //  };
    //
    //  sesMail.sendEmail(options, function(err, data) {
    //    if (err) {
    //      console.log(JSON.stringify(err));
    //      console.log("Mail sending failed");
    //      /*
    //        {"date":"2014-11-03T07:14:41.291Z",
    //          "receiver":{"ToAddresses":["receiver@example.com"]},
    //          "success":false,
    //          "result":{
    //            "message":"XXXXX",
    //            "code":"XXXXX",
    //            "errno":"XXXXX",
    //            "syscall":"XXXXX",
    //            "region":"XXXXX",
    //            "hostname":"XXXXX",
    //            "retryable":XXXXX,
    //            "time":"2014-11-03T07:14:41.291Z"
    //          }
    //        }
    //      */
    //    } else {
    //      console.log(JSON.stringify(data));
    //      console.log("Mail is sent successfully");
    //      /*
    //        {"date":"2014-11-03T08:21:56.720Z",
    //          "receiver":{"ToAddresses":["receiver@example.com"]},
    //          "success":true,
    //          "result":form
    //            {"ResponseMetadata":{"RequestId":"XXXXXXXXXXXXXXX"},
    //            "MessageId":"XXXXXXXXXX"}
    //          }
    //        }
    //      */
    //   }
    // });
    console.log("HELOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
    console.log(req.body.email);
    // smtpc.sendmail({
    //   	"host"		: "email-smtp.us-east-1.amazonaws.com",
    //   	"from"		: "no-reply@liveexamcenter.com",
    //   	"to"		: req.body.email,
    //   	"auth"		: [ "AKIAIP7ADIWKJCS5KXOA", "AryYI9O1f9jFX62AwA2mC3kWKhu2O+pjr5MY4x8EKjhv" ],
    //   	"content"	: {
    //   		"subject"		: "Hello snehal!",
    //   		"content-type"	: "text/html",
    //   		"content"		: "Hello <strong>Snehal</strong>!"
    //   	},
    //   		 function (err) {
    //          if(!err) {
    //   		console.log("Sent!");
    //     }
    //     else {
    //   		console.log("Error(%d): %s", err.code, err.message);
    //     }
    //   	}
    //   });
    /**
    SMTP Server: email-smtp.us-east-1.amazonaws.com
    Port:	25, 465 or 587
    Use Transport Layer Security (TLS):	Yes

    SMTP Username:
    AKIAIP7ADIWKJCS5KXOA
    SMTP Password:
    AryYI9O1f9jFX62AwA2mC3kWKhu2O+pjr5MY4x8EKjhv


    from : no-reply@liveexamcenter.com
    */


    // let s = new SMTPClient({
    //       host: 'email-smtp.us-east-1.amazonaws.com',
    //       port: 465
    //     });
    //
    //     (async function() {
    //       await s.connect();
    //       await s.greet({hostname: 'email-smtp.us-east-1.amazonaws.com'}); // runs EHLO command or HELO as a fallback
    //       await s.authPlain({username: 'AKIAIP7ADIWKJCS5KXOA', password: 'AryYI9O1f9jFX62AwA2mC3kWKhu2O+pjr5MY4x8EKjhv'}); // authenticates a user
    //       await s.mail({from: 'no-reply@liveexamcenter.com'}); // runs MAIL FROM command
    //       await s.rcpt({to: req.body.email}); // runs RCPT TO command (run this multiple times to add more recii)
    //       await s.data('mail source'); // runs DATA command and streams email source
    //       await s.quit(); // runs QUIT command
    //     })().catch(console.error);

    //var encryptedEmail = AES(req.body.email);
    var ciphertext = CryptoJS.AES.encrypt(req.body.email, config.secretKey);
    var newCipherText =  ciphertext.toString().replace(/\+/g,'THISISPLUS').replace(/\//g,'THISISSLASH').replace(/=/g,'THISISEQUALTO');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aditya@amdev.in',
        pass: '31095adi'
      }
    });

    var mailOptions = {
      from: 'shakalakalaka@jobportal.com',
      to: req.body.email,
      subject: 'Sending Email using Node.js',
      html: `<p>
      Hello, this is Job Portal
      </p>
      <p>
      Reset for ${req.body.email}
      </p>
      <p>
      Click
      <a href="http://localhost:4200/set-password/${newCipherText}">
      here
      </a>
      to get the reset password link
      </p>
      `
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        truthValueDoc.truthValue = true;
        res.status(200).json({status:'success',docs:truthValueDoc})
      }
    });

  },

  //changing password in DB,for the email address provided in url
  setPassword: function(req,res){
    var istrue= null;
    req.body.email.toString().replace(/THISISPLUS/g,'+').replace(/THISISSLASH/g,'/').replace(/THISISEQUALTO/g,'=');
    var bytes  = CryptoJS.AES.decrypt(req.body.email.toString(),config.secretKey);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);

    console.log(req.body.email);
    console.log(plaintext);
    console.log(req.body.newpassword);
    var myquery = { Email: plaintext };
    var newvalues = { $set: {Password: req.body.newpassword } };
    userModel.updateOne(myquery, newvalues, function(err, docs) {
      if (err) {
        truthValueDoc.truthValue= false;
        res.status(200).json({status:'success', message: 'Success', docs: truthValueDoc });
        console.log("1 document not updated");

      }
      else {
        truthValueDoc.truthValue = true;
        istrue = true;
        res.status(200).json({status:'success', message: 'Success', docs: truthValueDoc });
        console.log("1 document updated");
      }
    });
    console.log(truthValueDoc);
    console.log(istrue);


  },

  //Check image file criteria(type and size) if it satisfies then send true
  checkFileCriteria : function(req, res) {
    doc = {
      type: false,
      size: false
    }
    if(req.body.type == 'image/jpeg' || req.body.type == 'image/png' || req.body.type == 'image/jpg') {
      doc.type = true;
    }
    if((req.body.size/1000) <= 2000) {
      doc.size = true;
    }
    res.status(200).json({status:'success', message: 'Success', docs: doc });


  },
  //callback function call after the upload is done by multer
  //setting the global_path_file to file path provided by multer
  upload : function(req,res) {
    console.log("this is global path");
    console.log(req.file.path);
    global_path_file = req.file.path.toString();

    console.log("second time global path",global_path_file);
    var body = req.body
    global_user = body.username
    console.log(body.username);
    var name = req.file.path.split('/')[2];
    res.status(200).json({status:'success', message: name });
  },
  //Check status of user is login or not
  //accordingly return status : true or false
  checkLogin: function(req,res) {
      console.log("this is checklogin");
      console.log("this is req");
      //console.log(req);
      console.log("this is req.sessionStore.MemoryStore.sessions");
      //console.log(req.IncomingMessage);
      console.log("this is req.session.loginStatus");
      console.log(req.session.loginStatus);
      console.log(global_isLogin);
      if(req.session.loginStatus) {
        console.log("login is still true");
        res.json({
          docs: {
          status:true,
          message:'yup still logged in',
          username: req.session.username
        }
        })
      }
      else {
        console.log("login is still false");
        res.json({
          docs: {
          status:false,
          message:'nope, not logged in'
        }
        })
      }

  },

  //logout happens here i.e. session is destroyed for the logged out user
  logout: function(req,res) {
      //global_isLogin = false;
      console.log("SESSION LOGIN STATUS IS FALSE NOW");
      req.session.loginStatus = false;
      global_isLogin = false;
      console.log(req.session);
      console.log("SESSION IS DESTROYED NOW");
      req.session.destroy();
      global_isLogin = false;
      console.log("this is LOGOUT API");
      console.log("inside logout api");
      //console.log("logout clicked",req.session.loginStatus);
      res.json({
        docs: {
        status:false,
        message:'logout'
      }
      })

  },
  //get images from path ./public/uploads
  getPhotos: function(req,res) {
    fs.readdir(config.path, function(err, items) {
      if(err) {
          res.status(200).json({
            docs:{
            status:true
            }
          });
      }
      else {
      console.log(items);
      for (var i=0; i<items.length; i++) {
        console.log(items[i]);
      }
      res.status(200).json({
        docs:{
          status:true,
          filesArray:items,
          path:'/uploads'
        }
      });
    }
  })
}

};

// check uniqueness for username in userInfos colletion
var checkInUsernameDb = function(value,docs) {
  for(var i=0;i<docs.length;i++){
    console.log(value+" == "+docs[i].Username);
    if(value === docs[i].Username) {
      console.log("Username correct")
      return true;
    }
    else {
      console.log("Username incorrect")
      continue;
    }
  }

}

//check uniqueness for email in userInfos collection
var checkInEmailDb = function(value,docs) {
  for(var i=0;i<docs.length;i++){
    console.log(value+" == "+docs[i].Email);
    if(value === docs[i].Email) {
      console.log("Email correct")
      return true;
    }
    else {
      console.log("Email incorrect")
      continue;
    }
  }
}

//For login checking in DB is if user exists or not
var checkCredentialsInDb = function(data,docs) {
  console.log("this is inside checkCredentialsInDb js function",data);
  for(var i=0;i<docs.length;i++){
    console.log(data.username +"==="+ docs[i].Username +"&&"+ data.password +"==="+ docs[i].Password);
    if(data.username == docs[i].Username && data.password == docs[i].Password) {
      console.log("Credentials correct")
      return true;
    }
    else {
      console.log("Credentials incorrect")
      continue ;
    }
  }

}


module.exports = users;
