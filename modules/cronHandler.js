/*
 * Refresh Handler
 */
var schedule 	= require('node-schedule');
var request 	= require('request');

function CronHandler() {
	"user strict";

	var that = this;
	var crons = [];
	var base_url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=-1&q=';

	this.startCrons = function(subscriptions, callback) {
		if(subscriptions) {
			for(var i=0; i < subscriptions.length; i++) {
				this.handleCron(subscriptions[i], function(){});
			}
		}
		else{
			callback('start-crons-error');
		}
	};

	this.handleCron = function(subscription, callback) {
		if(subscription) {
			if(crons["'"+subscription._id+"'"] === undefined){
				console.log('to create cron...' + subscription._id);
				crons["'"+subscription._id+"'"] = schedule.scheduleJob('*/'+subscription.refr+' * * * *', function(){
					refreshSubscription(subscription);
				});				
				callback();
			}
			else{
				(crons["'"+subscription._id+"'"]).cancel();
				crons["'"+subscription._id+"'"] = undefined;
				this.handleCron(subscription, callback);
			}
		}
		else
			callback('cron-error');
	};
	
	var refreshSubscription = function(subscription) {
		console.log('updating... ' + subscription._id);
		var options = {
			url: base_url + subscription.url
		};
		request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		      var response = JSON.parse(body);
		      console.log(response.responseData.feed.entries.length);
		      response.responseData.feed.entries.forEach(function(item) {
		      	var data = {
		      		'titulo' : item.title,
		      		'link' : item.link,
		      		'fecha' : item.publishedDate,
		      		'author' : item.author,
		      		'texto' : item.content,
		      		'entrada' : item.contentSnippet,
		      		'def_cat' : item.categories,
		      	};
		      });
		    }
		    else{
		    	console.log('Update failed for '+subscription._id);
		    }
		 });
	};
};

module.exports = CronHandler;