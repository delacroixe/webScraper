/*
 * CRUD
 */

var db = require('mongoskin').db('localhost:27017/mydb',{safe: true});
var io = require('socket.io-client');
var socket = io.connect('http://localhost:4242');




/*
 * Find in a database.
 */

exports.all = function(callback){
  db.collection('news').find().toArray(function(err, result) {
    if (err) throw err;

    if(result.length === 0){
     callback("No hay resultado chic@");
    }else{
      callback(result);
    }
  });
};

exports.save = function(req, res){
  console.log(req);
  req.insertData = new Date().toISOString();
  db.collection('news').insert(req , function(err, result) {
    if (err) console.log(" Duplicado ! -> "+req.titulo);
    if (result){
      console.log('Added!');
      socket.emit('additem',req);
    }
  });
};

exports.last = function(callback){
  db.collection('news').find().sort({_id:1}).limit(20).toArray(function(err, result) {
    if (err) throw err;

    if(result.length === 0){
     console.log("No hay resultado chic@");
    }else{
      callback(result);

    }
  });
};



