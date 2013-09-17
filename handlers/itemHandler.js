var ItemDAO = require('../DAO/itemDAO').ItemDAO;

var AlchemyAPI = require('../modules/alchemyAPI').alchemyAPI;


function ItemHandler (db, io) {


	var item = new ItemDAO(db, io);
	var alchemy = new AlchemyAPI();

	this.showAll = function(req, res, next) {

		itemDAO.all(function(err, results) {

			if (err) return next(err);
			return res.send(results);
		});
	};

	this.saveOne = function(obj, callback) {

		alchemy.category(obj.url, function(data){
			obj.cat = data;
			itemDAO.save(obj, function(err, results) {
				if (err) callback(err);
				else {
					console.log('New item saved: '+obj.link);
				}
			});
		});
	};
}

module.exports = ItemHandler;