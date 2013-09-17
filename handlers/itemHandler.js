var ItemDAO = require('../DAO/itemDAO').ItemDAO;

var AlchemyAPI = require('../modules/alchemyAPI').alchemyAPI;


function ItemHandler (db) {

	var itemDAO = new ItemDAO(db);
	var alchemy = new AlchemyAPI();
	var that = this;

	this.getAll = function(req, res, next) {

		itemDAO.getAll(function(err, results) {

			if (err) return next(err);
			return res.send(results);
		});
	};

	this.getItems = function(req, res, next) {
		var last = req.param('rid');
		var limit = parseInt(req.param('l')) || 20;
		if (!last || last === '') {
			that.getAll(req, res, next);
		}
		else
			itemDAO.getItems(last, limit, function(err, results) {
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