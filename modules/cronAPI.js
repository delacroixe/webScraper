/*
 * Refresh Handler
 */
var schedule 	= require('node-schedule');
var request 	= require('request');
var ItemHandler = require('../handlers/itemHandler');
var DiffBotAPI 	= require('./diffBotAPI');

function CronHandler(db, io) {
	"user strict";

	var itemHandler = new ItemHandler(db, io);
	var diffBotAPI = new DiffBotAPI();
	var crons = [];
	var base_url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=-1&q=';
	

	var that = this;

	this.initCrons = function(callback) {
		db.collection('subscriptions').find().toArray(function(e, res) {
			if (e) callback(e)
			else {
				if(res) {
					for(var i=0; i < res.length; i++) {
						that.handleCron(res[i], function(){});
					}
					callback(null);
				}
				else{
					callback('start-crons-error');
				}
			}
		});
	};

	this.handleCron = function(subscription, callback) {
		if(subscription) {
			if(crons["'"+subscription._id+"'"] === undefined){
				console.log('Creating cron...' + subscription._id);
				crons["'"+subscription._id+"'"] = schedule.scheduleJob('*/'+subscription.refr+' * * * *', function(){
					that.refreshSubscription(subscription);
				});
				callback();
			}
			else{
				(crons["'"+subscription._id+"'"]).cancel();
				crons["'"+subscription._id+"'"] = undefined;
				that.handleCron(subscription, callback);
			}
		}
		else
			callback('handle-cron-error');
	};

	this.deleteCron = function(sub_id, callback) {
		if(sub_id) {
			if(crons["'"+sub_id+"'"] != undefined) {
				console.log("Deleting cron... "+sub_id);
				(crons["'"+sub_id+"'"]).cancel();
				crons["'"+sub_id+"'"] = undefined;
				callback();
			}
		}
		else {
			callback('cron-delete-error');
		}
	};

	this.refreshSubscription = function(subscription) {
		console.log('Updating... ' + subscription._id);

		if (subscription && subscription.type === 'rss') {
			refreshRSS(subscription);
		}
		else if (subscription && subscription.type === 'tw') {
			refreshTW(subscription);
		}
		
	};

	var refreshRSS = function(subscription) {
		var options = {
			url: base_url + subscription.url
		};
		request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		      var response = JSON.parse(body);
		      //console.log(response.responseData.feed.entries.length);
		      var entries = response.responseData.feed.entries.reverse(); 
		      entries.forEach(function(item) {
		      	diffBotAPI.getArticleJSON(item.link, function(json){
		      		var data = {};
		      		if(json != null) {
		      			data = {
				      		'titulo' : json.title,
				      		'link' : json.resolved_url,
				      		'fecha' : json.date,
				      		'author' : json.author,
				      		'texto' : json.text,
				      		'entrada' : item.contentSnippet,
				      		'def_cat' : json.tags,
				      		'img' : jsonMediaFinder(json.media) || imgFinder(item.content)
				      	};
		      		}
		      		else {
				      	data = {
				      		'titulo' : item.title,
				      		'link' : item.link,
				      		'fecha' : item.publishedDate,
				      		'author' : item.author,
				      		'texto' : item.content,
				      		'entrada' : item.contentSnippet,
				      		'def_cat' : item.categories,
				      		'img' : imgFinder(item.content)
				      	};
		      		}
		      		data.tags = subscription.tags;
		      		itemHandler.saveOne(data, function(e){});
		      	});
		      });
		    }
		    else{
		    	console.log('Update failed for '+subscription._id);
		    }
		});
	};

	var refreshTW = function(subscription) {

	};

	var imgFinder = function(text) {
		var b = text.indexOf('img src=');
		var b2 = text.indexOf('.jpg');

		if((b != -1)&&(b2 != -1))
		var img = text.substring(b+9,b2+4); 
		else var img = "http://www.rtpa.es/images/rss.jpg";

		return img;
	}

	var jsonMediaFinder = function (data) {
		result = null;
		if(data) {
			for(var i = 0; i < data.length; i++) {
				if(data[i].primary === 'true'){
					result = data[i].link;
				}
			}
		}
		return result;
	}
};

module.exports = CronHandler;