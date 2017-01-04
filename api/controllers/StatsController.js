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
		var debut = moment().format("YYYY-MM-DD");
		var fin = moment().format("YYYY-MM-DD");
		var periode = 1;

		if(req.params.debut !== null && req.params.debut !== undefined) {
			debut = req.params.debut;
		}
		if(req.params.fin !== null && req.params.fin !== undefined) {
			fin = req.params.fin;
		}
		if (req.params.periode !== null && req.params.periode !== undefined) {
			periode = req.params.periode;
		}

		logger.warn("OK dans le controller stocks");
		var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();

		return res.render ('stats/ventes',{'action': 'stats', 'periode': periode, 'd1': debut, 'd2': fin, 'menu': menu});
	},

	ventes_jour: function (req, res) {
				
		sails.models.commandes.getCommandes(req, function(err, results){
			if (err !== null && err !== undefined) {
				return res.send({"err": err, "msg": null});
			} else {
				logger.util(results);
				var tb = [];
				var somme_ht = 0;
				var somme_tva = 0;
				var somme_ttc = 0;
				var somme_com = 0;	
				var ccc = 0;
				if(results.length == 0) return res.send({"err": "Pas de commandes", "msg": null});
				for (var c = 0; c < results.length; c++) {
					var idC = results[c][0];//id_commande idc
					var id_client = results[c][11];//id_client
					logger.warn('attention idC: ', idC);
					logger.warn('attention id_client: ', id_client);
					
					sails.models.commandes.getOneFullCommandeHistorique(idC, id_client, function(err, fCom) {
						//Tous les produits de 1 commande
						for(var cptP = 0; cptP < fCom.produits.length; cptP++) {
							var prd = [];
							prd.push(fCom.produits[cptP].id);
							prd.push(fCom.produits[cptP].nom);
							prd.push(fCom.produits[cptP].achat_ttc);
							prd.push(fCom.produits[cptP].pht);
							prd.push(fCom.produits[cptP].tva);//4
							prd.push(fCom.produits[cptP].commission);
							prd.push(fCom.produits[cptP].qte);
							prd.push(fCom.produits[cptP].ttl_ht);
							somme_ht += fCom.produits[cptP].ttl_ht;
							prd.push(fCom.produits[cptP].ttl_tva);
							somme_tva += fCom.produits[cptP].ttl_tva;
							prd.push(fCom.produits[cptP].ttc);
							somme_ttc += fCom.produits[cptP].ttc;
							prd.push(fCom.produits[cptP].ttl_com);
							somme_com += fCom.produits[cptP].ttl_com;
							prd.push(fCom.produits[cptP].tx_com);//11
							prd.push(fCom.produits[cptP].tx_tva);//12
							logger.util('co ', prd);
							tb.push(prd);
						}
						if(ccc == results.length-1) {
							var objResult = {"data": null};
							objResult.data = tb;
							objResult.recap = {
								'somme_ht': parseInt(somme_ht * 100) / 100,
								'somme_tva': parseInt(somme_tva * 100) / 100,
								'somme_ttc': parseInt(somme_ttc * 100) / 100,
								'somme_com': parseInt(somme_com * 100) / 100
							};
							objResult.err = null;
							res.send(objResult);
						}
						ccc++;
					});
				}

				//return res.send({"err": null, "msg": results});
			}

		});
		
	}
};

