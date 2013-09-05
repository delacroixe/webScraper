
var AlchemyAPI = require('alchemy-api');

function alchemyAPI () {

	var alchemy = new AlchemyAPI('74631f889f9d816cc4aae9e38dbe8d5cd4b9787b');

	this.keywords = function (testURL, callback) {
		alchemy.keywords(testURL, {}, function(err, response) {
		  if (err) throw err;

		  var keywords = response.keywords;
<<<<<<< HEAD
		  callback(keywords);
=======
		  //console.log("keywords");
		  //console.log(keywords);
		  //console.log(response);
>>>>>>> 279a6579634a57293f62ea733396e0bec2bd8673

		});
	}

	this.entities = function (testURL, callback) {
		alchemy.entities(testURL, {}, function(err, response) {
		  if (err) throw err;

		  var entities = response.entities;
<<<<<<< HEAD
		  callback(entities);
=======
		  //console.log("entidades");
		  //console.log(entities);
		  //console.log(response);
>>>>>>> 279a6579634a57293f62ea733396e0bec2bd8673

		});
	}

	this.category = function (testURL, callback) {
		alchemy.category(testURL, {}, function(err, response) {
		  if (err) throw err;

		  var category = response.category;
<<<<<<< HEAD
=======
		  //console.log("category");
		  //console.log(category);
>>>>>>> 279a6579634a57293f62ea733396e0bec2bd8673
		  callback(category)

		});
	}
}

module.exports.alchemyAPI = alchemyAPI;