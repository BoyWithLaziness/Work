var config = {

    port :3000,
    site :'http://localhost/DBsuper/#/',

    mongo : {

            hostname : 'localhost',
            port : '27017',
            db : 'JobPortal'

    },
    secretKey: '2938ywe2($*^&)#*owef83409708_muralianiketnilamsnehaladitya;',
    username:'',
    path: './public/uploads/'
};

config.mongo.url ='mongodb://' + config.mongo.hostname + ':' + config.mongo.port + '/' +config.mongo.db;

module.exports = config;
