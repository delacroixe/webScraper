/*
 * CRUD
 */

var db = require('mongoskin').db('localhost:27017/mydb',{safe: true});


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
  db.collection('news').insert(req , function(err, result) {
    if (err) console.log(" Duplicado ! -> "+req.titulo);
    if (result){
      console.log('Added!');
    }
  });
};
