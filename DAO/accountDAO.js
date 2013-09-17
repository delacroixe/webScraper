/*
 *
 */
var moment    = require('moment');

function AccountDAO(db) {
  "use strict";

  var that = this;

  if (false === (this instanceof AccountDAO)) {
      console.log('Warning: AccountDAO constructor called without "new" operator');
      return new AccountDAO(db);
  }

  this.getObjectId = function (id) {
    return db.collection('accounts').db.bson_serializer.ObjectID.createFromHexString(id)
  }

  this.getByUser = function (user, callback) {
    db.collection('accounts').findOne({user:user}, callback);
  };

  this.getByEmail = function (email, callback) {
    db.collection('accounts').findOne({email:email}, callback);
  };

  this.getById = function (id, callback) {
    db.collection('accounts').findOne({_id: that.getObjectId(id)}, function(e, res) {
      if (e) callback(e)
      else callback(null, res)
    });
  };

  this.getByMultipleFields = function (a, callback) {
    // this takes an array of name/val pairs to search against {fieldName : 'value'} //
    db.collection('accounts').find( { $and : a } ).toArray( function(e, results) {
      if (e) callback(e)
      else callback(null, results)
    });
  };

  this.add = function (newData, callback) {
    // append date stamp when record was created //
    newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
    db.collection('accounts').insert(newData, {safe: true}, callback);
  };

  this.update = function (account, callback) {
    db.collection('accounts').save(account, {safe: true}, callback);
  };

  this.delete = function (id, callback) {
    db.collection('accounts').remove({_id: that.getObjectId(id)}, callback);
  };
};

module.exports = AccountDAO;