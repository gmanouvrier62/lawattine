/**
 * StocksController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var logger = require('../services/logger.init.js').logger("tom.txt");
var achats = require('../services/achatsTool.js');
var moment = require("moment");

module.exports = {
	home: function (req, res) {
		var tom ="";
		logger.warn("OK dans le controller stocks");
		var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
		return res.render ('achats/stock',{'action': 'stocks', 'menu': menu});
		
	},
	modify_stock: function (req, res) {
		var tb = req.body.datas;
		var ccc = 0;
		for (var c = 0; c < tb.length; c++) {
			var ins = { 'id_produit': tb[c].id_produit, 'qte': tb[c].mouvement, 'raison': 'ajustement'};
			sails.models.achats.addStock(ins, function(err, results){
				if (err !== null) {
					logger.error(err);
					allErr += err;	
				} 
				if (ccc = tb.length-1)
					res.send(null);
				ccc++;
			});
		}
	},
	getAllStock: function (req, res) {
		var retour = {'err': null};
		sails.models.achats.getAllStock(function(err,results) {
			if(err !== null && err !== undefined && err !== "") {
				retour.err = err;
				return res.send(retour);
			}
			//retour.err = null;
			//retour.data = results;
			res.send(results);
		});
	}
};

