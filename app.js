
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
var CronAPI = require('./modules/cronAPI');

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



    routes(app, db, CronAPI, io);

    server.listen(PORT, function (){
      console.log("working! on port "+ PORT);
    });
});



