
var AlchemyAPI = require('alchemy-api');



function alchemyAPI () {

	var alchemy = new AlchemyAPI('74631f889f9d816cc4aae9e38dbe8d5cd4b9787b');

	this.keywords = function () {
		alchemy.keywords(testURL, {}, function(err, response) {
		  if (err) throw err;

		  // See http://www.alchemyapi.com/api/ for format of returned object

		  var keywords = response.keywords;
		  //console.log("keywords");
		  //console.log(keywords);
		  //console.log(response);

		  // Do something with data
		});
	}

	this.entities = function () {
		alchemy.entities(testURL, {}, function(err, response) {
		  if (err) throw err;

		  // See http://www.alchemyapi.com/api/ for format of returned object

		  var entities = response.entities;
		  //console.log("entidades");
		  //console.log(entities);
		  //console.log(response);

		  // Do something with data
		});
	}

	this.category = function (testURL, callback) {
		alchemy.category(testURL, {}, function(err, response) {
		  if (err) throw err;

		  // See http://www.alchemyapi.com/api/ for format of returned object

		  var category = response.category;
		  //console.log("category");
		  //console.log(category);
		  callback(category)
		  //console.log(response);

		  // Do something with data
		});
	}
}

module.exports.alchemyAPI = alchemyAPI;