/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var logger = require('../services/logger.init.js').logger("tom.txt");

module.exports = {
	home: function (req, res) {
		var tom ="";
		var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
		
		return res.render ('achats/achats_list',{'action': 'achats', 'menu': menu});
	},
	achat_todo: function (req, res) {
		//Rappel : on ne prend que les commandes en status 2 (validées)
		var sql = "select sum(qte) as total, id_produit, nom, ttc_externe, tva, sum(qte)*ttc_externe  ";
			sql += "from cmd_pr cp inner join commandes c on c.id=cp.id_commande ";
			sql += "inner join produits pr on pr.id=cp.id_produit ";
			sql += "where c.status = 2 group by id_produit";
			
	}

};

