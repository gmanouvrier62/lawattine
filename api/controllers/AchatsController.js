/**
 * AdminController
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
		var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
		return res.render ('achats/achats_liste',{'action': 'achats', 'menu': menu});
		
	},
	achat_todo: function (req, res) {
		achats(function(err, datas){
			if (err !== null && err !== undefined) {
				logger.error(err);
				return res.send("ERREUR");
			}
			logger.warn('va retourner un truc');
			logger.util(datas);

			res.send(datas);
		});
	},
	faire_achat: function (req, res) {
		//Principe de l'achat : 
		//rajout d'une quantité de produit dans la table achat un peu comme un stock (ou les credits nm)
		var tb = req.body.datas;
		var allErr = "";
		var ccc = 0;
		logger.util(tb);
		for (var c = 0; c < tb.length ; c++) {
			var ins = {
				'id_produit': tb[c].id_produit,
				'qte': isNaN(parseInt(tb[c].qte_ttl))? 0: parseInt(tb[c].qte_ttl),
				'raison': 'achat',
				'createdAt': moment().format("YYYY-MM-DD HH:mm:ss")
			};
			logger.warn(ins);
			
			sails.models.achats.addStock(ins, function (err, result) {
				
				if (err !== null) {
					logger.error(err);
					allErr += err;	
				} 
				if (ccc = tb.length-1)
					res.send(null);
				ccc++;
			});

		}
	}
};

