/*
 * Subscriptions Handler
 */
var moment 		= require('moment');
var SubscriptionDAO = require('../DAO/subscriptionDAO');

function SubscriptionHandler(db, ch){
	"user strict";

	var subs_type = [
		{short: 'rss', name: 'RSS'}
	];

	var subscriptionDAO = new SubscriptionDAO(db);
	var that = this;

	this.handleSubscription = function(newData, callback) {
		if(newData.id === ''){
			addSubscription(newData, callback);
		}
		else{
			subscriptionDAO.getOneById(newData.id, function(e, o) {
				if (e){
					addSubscription(newData, callback);
				}	else{
					updateSubscription(newData, callback);
				}
			});
		}
	}

	this.getSubscriptions = function(user, callback) {
		subscriptionDAO.getAll(callback);
	}

	this.getSubscriptionById = function(id, callback) {
		subscriptionDAO.getOneById(id, callback);
	}

	this.deleteSubscription = function(id, callback) {
		subscriptionDAO.delete(id, function(err, result){
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
		subscriptionDAO.getOneByURL(data.url, function(e, o){
			if (o){
				callback('subscription-exists');
			}	else{	
				subscriptionDAO.add(data, function(err, result){
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
		subscriptionDAO.getOneById(data.id, function(e, o){
			if (e){
				callback(e, null);
			}	else{
				o.name = data.name;
				o.url = data.url;
				o.desc = data.desc;
				o.refr = data.refr;
				o.date = moment().format('MMMM Do YYYY, h:mm:ss a');
		        subscriptionDAO.update(o, function(err, result){
					if(err){
						callback(e);
					}
					else
						ch.handleCron(o, callback);
				});
			}
		});
	}
};

module.exports = SubscriptionHandler;

