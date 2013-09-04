/*
 * Subscriptions Handler
 */
var moment 		= require('moment');

function SubscriptionHanlder(db, ch){
	"user strict";

	var subs_type = [
		{short: 'rss', name: 'RSS'}
	];

	var that = this;

	this.handleSubscription = function(newData, callback) {
		if(newData.id === ''){
			addSubscription(newData, callback);
		}
		else{
			db.collection('subscriptions').findOne({_id: getSubscriptionObjectId(newData.id)}, function(e, o) {
				if (e){
					addSubscription(newData, callback);
				}	else{
					updateSubscription(newData, callback);
				}
			});
		}
	}

	this.getSubscriptions = function(user, callback) {
		db.collection('subscriptions').find().toArray(
			function(e, res) {
			if (e) callback(e)
			else callback(res)
		});
	}

	this.getSubscriptionById = function(id, callback) {
		db.collection('subscriptions').findOne({_id: getSubscriptionObjectId(id)}, callback);
	}

	this.deleteSubscription = function(id, callback) {
		var sid = getSubscriptionObjectId(id);
		db.collection('subscriptions').remove({_id: sid}, function(err, result){
			if(err){
				callback(e);
			}
			else
				ch.deleteCron(sid, callback);
			});
	}

	this.getAllSubsType = function(callback) {
		return subs_type;
	}

	var addSubscription = function(data, callback)	{
		db.collection('subscriptions').findOne({url:data.url}, function(e, o){
			if (o){
				callback('subscription-exists');
			}	else{	
				data.date = moment().format('MMMM Do YYYY, h:mm:ss a');
				
				db.collection('subscriptions').insert(data, {safe: true}, function(err, result){
					if(err){
						callback(e);
					}
					else
						ch.handleCron(result[0], callback);
				});
			}	
		});
	}

	var updateSubscription = function(data, callback) {
		db.collection('subscriptions').findOne({_id: getSubscriptionObjectId(data.id)}, function(e, o){
			if (e){
				callback(e, null);
			}	else{
				o.name = data.name;
				o.url = data.url;
				o.desc = data.desc;
				o.refr = data.refr;
				o.date = moment().format('MMMM Do YYYY, h:mm:ss a');
		        db.collection('subscriptions').save(o, {safe: true}, function(err, result){
					if(err){
						callback(e);
					}
					else
						ch.handleCron(o, callback);
				});
			}
		});
	}

	var findSubscriptionById = function(id, callback) {
		db.collection('subscriptions').findOne({_id: getSubscriptionObjectId(id)},
			function(e, res) {
			if (e) callback(e)
			else callback(null, res)
		});
	};

	var getSubscriptionObjectId = function(id)	{
		if(!id || id === '') return '';
		return db.collection('subscriptions').db.bson_serializer.ObjectID.createFromHexString(id)
	}
};

module.exports = SubscriptionHanlder;

