var moment = require('moment');
var logger = require('../services/logger.init.js').logger("tom.txt");


module.exports = function(callback){
		function calculHT(ttc_achat,tva) {
	        var resultat = parseFloat(ttc_achat) /(1 + (parseFloat(tva)/100) );
	        return Math.round(resultat *100)/100;
        }
//Rappel : on ne prend que les commandes en status 2 (validées)
		var sql = "select sum(cp.qte) as quantite, ";
			sql += "cp.id_produit, ";
			sql += "pr.nom, ";
			sql += "pr.icone, ";
			sql += "t.nom as rayon, ";
			sql += "t.id as rayon_id, ";
			sql += "ttc_externe, ";
			sql += "tva, ";
			sql += "qte_ok, ";
			sql += "cp.id as index_ligne, ";
			sql += "sum(cp.qte)*ttc_externe  as ttl_achat ";
			sql += "from cmd_pr cp inner join commandes c on c.id=cp.id_commande ";
			sql += "inner join produits pr on pr.id=cp.id_produit ";
			sql += "inner join typesproduits t on t.id=pr.id_type ";
			sql += "where c.status = 2 group by id_produit";
		logger.warn(sql);
		sails.models.cmd_pr.query(sql, function(err, lignes) {
			if(err !== null && err !== undefined) return callback(err,null);
			
			var tb = [];
			var ccc = 0;
			for(var cpt = 0; cpt < lignes.length; cpt++) {
				var stb = [];
				stb.push(lignes[cpt].id_produit);
				stb.push(lignes[cpt].nom);
				stb.push(lignes[cpt].ttc_externe);
				stb.push(lignes[cpt].tva);
				stb.push(lignes[cpt].quantite);
				stb.push(lignes[cpt].ttl_achat);
				stb.push(calculHT(lignes[cpt].ttl_achat,lignes[cpt].tva));
				stb.push(lignes[cpt].qte_ok);
				stb.push(lignes[cpt].rayon);
				stb.push(lignes[cpt].icone);
				stb.push(lignes[cpt].rayon_id);
				stb.push(lignes[cpt].index_ligne);
				//stb.push(lignes[cpt].qte_dispo);
				//faire une fct avec callback
				sails.models.achats.getStock(stb, function(err, result){
					
					if (err !== null && err !== undefined) {
						logger.error("il y a eu un pb : ", err);
					} else {
						tb.push(result);
					}
						
					if(ccc == lignes.length-1) {
						logger.info("ok pour le callbacking");
						var objResult = {"data": null};
						objResult.data = tb;
						callback(null,objResult);
					}
					ccc ++;
				});	
			}
		});	
	
};

