
/**
 * Module dependencies.
 */

var express = require('express');
var io = require('socket.io');

var PORT = 4242;

var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.set('log level', 1);


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
  app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes/router')(app);

server.listen(PORT, function (){
  console.log("working! on port "+ PORT);
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
