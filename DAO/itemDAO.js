/*
 * CRUD
 */



var rtc = require('../modules/realTime').realTime;

function ItemDAO(db, io) {

  "use strict";

  var that = this;

  /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if (false === (this instanceof ItemDAO)) {
      console.log('Warning: ItemDAO constructor called without "new" operator');
      return new ItemDAO(db);
  }

  this.getAll = function(callback){

    var rt = new rtc(io);
    db.collection('news').find().toArray(function(err, result) {
      if (err) throw err;

      if(result.length === 0){
       callback("No hay resultado chic@");
      }else{
        callback(result);
      }
    });
  }

  this.getItems = function(last, limit, callback) {
    db.collection('news').find({_id:{$gt: that.getObjectId(last)}}).sort({_id:1}).limit(limit).toArray(function(err, result) {
      if (err) throw err;
      else callback(result);
    });
  }

  this.save = function(data, callback){

    data.insertData = new Date().toISOString();
    db.collection('news').findOne({link: data.link}, function(e, o) {
      if(o) {
        callback('error-new-exists')
      }
      else{
        db.collection('news').insert(data , function(err, result) {
          //if (err) console.log(" Duplicado ! -> "+data.titulo);
          if (err) return callback(err, null);
          if (result){
            callback(err, result);
            rt.refresh(data);
          }
        });
      }
    });
  };

  this.getObjectId = function (id) {
    return db.collection('news').db.bson_serializer.ObjectID.createFromHexString(id)
  }

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





