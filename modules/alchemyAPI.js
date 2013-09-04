
var AlchemyAPI = require('alchemy-api');

function alchemyAPI () {

	var alchemy = new AlchemyAPI('74631f889f9d816cc4aae9e38dbe8d5cd4b9787b');

	this.keywords = function (testURL, callback) {
		alchemy.keywords(testURL, {}, function(err, response) {
		  if (err) throw err;

		  var keywords = response.keywords;
		  callback(keywords);

		});
	}

	this.entities = function (testURL, callback) {
		alchemy.entities(testURL, {}, function(err, response) {
		  if (err) throw err;

		  var entities = response.entities;
		  callback(entities);

		});
	}

	this.category = function (testURL, callback) {
		alchemy.category(testURL, {}, function(err, response) {
		  if (err) throw err;

		  var category = response.category;
		  callback(category)

		});
	}
}

module.exports.alchemyAPI = alchemyAPI;