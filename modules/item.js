var ItemDAO = require('./itemDAO').ItemDAO;
var AlchemyAPI = require('./alchemyAPI').alchemyAPI;


function ItemHandler (db) {
		var obj = {
					  "title":"Özil vale medio Bale",
					  "link":"http://marca.feedsportal.com/c/33136/f/538105/s/30b98f24/sc/12/l/0L0Smarca0N0C20A130C0A90C0A30Cfutbol0Cequipos0Creal0Imadrid0C13781675570Bhtml/story01.htm",
					  "author": "Hugo Cerezo . Madrid",
					  "publishedDate": "Mon, 02 Sep 2013 22:56:02 -0700",
					  "contentSnippet": "Mesut Özil ya no es jugador del Real Madrid. Ayer casi de madrugada se confirmó su traspaso al Arsenal. El alemán deja en la ...",
					  "content": "Mesut Özil ya no es jugador del Real Madrid. Ayer casi de madrugada se confirmó su traspaso al Arsenal. El alemán deja en la caja blanca 45 millones -más cinco variables-, la mitad del traspaso de Bale, la que es mejor venta de la historia blanca. El club ha ingresado 111,5 millones en ventas este verano, una cifra récord.",
					  "categories":[ "Mesut Özil (Özil)","Fútbol", "Madrid (Real Madrid Club de Fútbol)" ]
				  };

	var item = new ItemDAO(db);
	var alchemy = new AlchemyAPI();

	this.showAll = function(req, res, next) {

		item.all(function(err, results) {

			if (err) return next(err);

			return res.send(results);
		});
	};

	this.saveOne = function(req, res, next) {

		var testURL = obj.link;
		console.log(obj.link);

		alchemy.category(testURL, function(data){
			console.log(data);
			obj.cat = data;
			console.log(obj);
			item.save(obj, function(err, results) {

				if (err) return next(err);

				return res.send(results);
			});
		});
	};
}

module.exports = ItemHandler;