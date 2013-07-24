

var cheerio = require('cheerio');
var IM = require('./item-manager');

exports.scrap = function(body){


  $ = cheerio.load(body);

  var titulo = $('h2').text();
  var entrada = $('.bajada').html();
  var foto = $('#foto img').attr('src');
  var fotopie = $('.epigrafe').html();
  var texto = $('#idcuerpo').html();
  var fecha = $('.mBott10px strong').html();

  var post = {
                  'titulo':titulo,
                  'entrada':entrada,
                  'foto':foto,
                  'fotopie':fotopie,
                  'texto':texto,
                  'fecha':fecha
                };

  IM.save(post);


};