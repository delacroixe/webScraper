var util 		= require('util'); 	
var twitter 	= require('twitter');

function TwitterHandler() {
	"use strict";

	var twit = new twitter({
  		consumer_key: 'agbVt1CyTPL27ZltK1oHtw',
  		consumer_secret: '0w1NJZkiPNdZOURB7OaZNnAI7GnPMmzipFIGoyirOVY',
  		access_token_key: '301898582-asSJYtKMCI6HJvnQtrjDwaxmyv3rsaFXa0QuPCms',
  		access_token_secret: 'HkIbH3cXCgM3EQCuxunMM0A79812vGXbaaUbTK6A9WQ'
	});
	var tstream = null;
	var api_url = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=';
	var that = this;

	this.getUserInfo = function(username, callback) {
		twit.stream('user', {screen_name:username}, function(stream) {
			tstream = stream;
			stream.on('data', function(data){
				console.log(util.inspect(data));
				callback(util.inspect(data));
			});
			stream.on('destroy', function(response) {
				console.log('Destroying stream...');
				callback();
			});
		});
		/*
		
		twit.get('user', {include_entities:true, screen_name:username}, function(data) {
    		console.log(util.inspect(data));
		});
		twit.verifyCredentials(function(data) {
			console.log(util.inspect(data));
		});
		*/
	};

	this.destroyTwit = function(callback) {
		if (tstream) {
			tstream.destroy;
		}
		else callback('error-destroying-twitt')
	}

	this.getUserTimeline = function(username, callback) {

	};

};

module.exports = TwitterHandler;