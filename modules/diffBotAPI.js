var request 	= require('request');

function DiffBotAPI() {
	"user strict";

	var base_url = 'http://www.diffbot.com/api/article?token=c6428748fab16c463017269dbb8d1385&url=';
	var that = this;

	this.getArticleJSON = function (url, callback) {
		var options = {
			url: base_url + url
		};
		request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		      var response = JSON.parse(body);
		      if(response){
		      	callback(response);
		      }
		    }
		    else{
		    	console.log('Could not get Articles JSON: '+url);
		    	callback(null);
		    }
		});
	};
};

module.exports = DiffBotAPI;
