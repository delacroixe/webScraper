var ItemDAO = require('../DAO/itemDAO').ItemDAO;

var AlchemyAPI = require('../modules/alchemyAPI').alchemyAPI;


function ItemHandler (db) {

	var item = new ItemDAO(db);
	var alchemy = new AlchemyAPI();

	this.showAll = function(req, res, next) {

		item.all(function(err, results) {

			if (err) return next(err);
			return res.send(results);
		});
	};

	this.saveOne = function(obj, callback) {

		alchemy.category(obj.url, function(data){
			obj.cat = data;
			item.save(obj, function(err, results) {
				if (err) callback('Errorea itema gordetzean');
			});
		});
	};
}

module.exports = ItemHandler;