/*
 * CRUD
 */

//var db = require('mongoskin').db('localhost:27017/mydb',{safe: true});
// var io = require('socket.io-client');
// var socket = io.connect('http://localhost:4242');



function ItemDAO(db) {
  "use strict";

  /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if (false === (this instanceof ItemDAO)) {
      console.log('Warning: ItemDAO constructor called without "new" operator');
      return new ItemDAO(db);
  }

  this.all = function(callback){
    db.collection('news').find().toArray(function(err, result) {
      if (err) throw err;

      if(result.length === 0){
       callback("No hay resultado chic@");
      }else{
        callback(result);
      }
    });
  }

  this.save = function(data, callback){

    data.insertData = new Date().toISOString();
    db.collection('news').findOne({url: data.url}, function(e, o) {
      if(o) {
        callback('error-new-exists')
      }
      else{
        db.collection('news').insert(data , function(err, result) {
          //if (err) console.log(" Duplicado ! -> "+data.titulo);
          if (err) return callback(err, null);
          if (result){
            callback(err, result);
            //socket.emit('additem',req);
          }
        });
      }
    });
  };

  // this.last = function(callback){
  //   db.collection('news').find().sort({_id:1}).limit(20).toArray(function(err, result) {
  //     if (err) throw err;

  //     if(result.length === 0){
  //      console.log("No hay resultado chic@");
  //     }else{
  //       callback(result);

  //     }
  //   });
  // };

};

module.exports.ItemDAO = ItemDAO;





