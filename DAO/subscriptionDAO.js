/*
 *
 */

function SubscriptionDAO(db) {
  "use strict";

  var that = this;

  if (false === (this instanceof SubscriptionDAO)) {
      console.log('Warning: SubscriptionDAO constructor called without "new" operator');
      return new SubscriptionDAO(db);
  }

  this.getObjectId = function(id)	{
		if(!id || id === '') return '';
		return db.collection('subscriptions').db.bson_serializer.ObjectID.createFromHexString(id)
	}

  this.getAll = function (callback) {
  	db.collection('subscriptions').find().toArray(function(e, res) {
  		if (e) callback(e)
		else callback(res)
	});
  };

  this.getOneById = function(id, callback){
  	db.collection('subscriptions').findOne({_id: that.getObjectId(id)}, callback);
  };

  this.getOneByURL = function(url, callback) {
  	db.collection('subscriptions').findOne({url:url}, callback);
  };

  this.add = function (data, callback) {
    data.date = moment().format('MMMM Do YYYY, h:mm:ss a');		
	  db.collection('subscriptions').insert(data, {safe: true}, callback);
  };

  this.update = function (data, callback) {
    db.collection('subscriptions').save(data, {safe: true}, callback);
  };

  this.delete = function (id, callback) {
  	db.collection('subscriptions').remove({_id: that.getObjectId(id)}, callback);
  };

};

module.exports = SubscriptionDAO;