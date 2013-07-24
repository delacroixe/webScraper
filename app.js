
/**
 * Module dependencies.
 */

var service = require('./modules/services');
var crud = require('./modules/crud');


var express = require('express');
var io = require('socket.io');

var PORT = 4242;

var app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

	io.set('log level', 1);


// app.configure(function(){
//   app.use(express.methodOverride());
//   app.use(express.bodyParser());
//   app.use(express.static(__dirname + '/'));
//   app.use(app.router);
// });

server.listen(PORT, function (){
  console.log("working! on port " + PORT );
});


app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
  next();

});


//Una ruta que devuelve ese String
app.get('/noticias', function (req, res) {
  crud.all(function(obj){
    res.json(obj);
  });
});

// Llama al RSS y por cada link extra el la noticia y la guarda
app.get('/list', function (req, res) {
  service.list(function(c){
    //console.log(c);
    res.send(c);
  });

});



// Required functions
require('./modules/io')(io);
