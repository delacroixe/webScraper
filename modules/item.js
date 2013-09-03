var ItemDAO = require('./itemDAO').ItemDAO;


function ItemHandler (db) {
    "use strict";

    var item = new ItemDAO(db);

    this.displayAll = function(req, res, next) {

		item.all(function(err, results) {

            if (err) return next(err);

            return res.send(results);
        });
    }
};

module.exports = ItemHandler;