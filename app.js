
/**
 * Module dependencies.
 */

var express = require('express');
var io = require('socket.io');
var MongoClient = require('mongodb').MongoClient; // Driver for connecting to MongoDB
var routes = require('./routes/router');
var PORT = 4242;

var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);


io.set('log level', 1);


MongoClient.connect('mongodb://localhost:27017/scraperdb', function(err, db) {
    "use strict";
    if(err) throw err;

    app.configure(function(){
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.locals.pretty = true;
      app.use(express.favicon());
      //app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.cookieParser());
      app.use(express.session({ secret: 'web-scraper-center' }));
      app.use(express.methodOverride());
      app.use(require('stylus').middleware({ src: __dirname + '/public' }));
      app.use(express.static(__dirname + '/public'));
    });

    app.configure('development', function(){
      app.use(express.errorHandler());
    });

    //require('./routes/router')(app);
    routes(app, db);

    server.listen(PORT, function (){
      console.log("working! on port "+ PORT);
    });
});




// var testURL = "http://www.tulankide.com/es/mondragon-unibertsitatea-ha-contado-con-stand-en-la-21-edicion-de-euskal-encounter";
// var AlchemyAPI = require('alchemy-api');
// var alchemy = new AlchemyAPI('74631f889f9d816cc4aae9e38dbe8d5cd4b9787b');


// alchemy.keywords(testURL, {}, function(err, response) {
//   if (err) throw err;

//   // See http://www.alchemyapi.com/api/ for format of returned object

//   var keywords = response.keywords;
//   console.log("keywords");
//   console.log(keywords);
//   //console.log(response);

//   // Do something with data
// });

// alchemy.entities(testURL, {}, function(err, response) {
//   if (err) throw err;

//   // See http://www.alchemyapi.com/api/ for format of returned object

//   var entities = response.entities;
//   console.log("entidades");
//   console.log(entities);
//   //console.log(response);

//   // Do something with data
// });


// alchemy.category(testURL, {}, function(err, response) {
//   if (err) throw err;

//   // See http://www.alchemyapi.com/api/ for format of returned object

//   var category = response.category;
//   console.log("category");
//   console.log(category);
//   //console.log(response);

//   // Do something with data
// });

// Required functions
require('./modules/io')(io);
