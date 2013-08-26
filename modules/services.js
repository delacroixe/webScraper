
/*
 * Take external news.
 */


var scraper = require('./scraper');
var request = require('request');


exports.list = function(callback){

  var list = '';

  var options = {
    url : 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=-1&q=http%3A//www.theyarenews.com/servicios/rss.asp?r=651'
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var response = JSON.parse(body);
      console.log(response.responseData.feed.entries.length);
      response.responseData.feed.entries.forEach(function(item){
        list += item.link+'<br>';
        news(item.link);
      });
    }
    callback(list);
 });



};


var news = function(dir){

  var options = {
    url : dir,
    encoding: 'binary'
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      scraper.scrap(body);
    }
  });
};


