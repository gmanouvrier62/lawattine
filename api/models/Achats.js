var logger = require('../services/logger.init.js').logger("tom.txt");
var moment = require('moment');

module.exports = {

  attributes: {

    id: { type: 'int' },

    id_produit: { type: 'int' },

    id_commande: { type: 'int' },

    qte: {type: 'int'},

    raison: {type: 'string'},

    createdAt: {type: 'datetime'}

  },
  getStock: function (stb, callback) {

  	var sqlStock = "select sum(qte) as total from achats where id_produit=" + stb[0];
		logger.info(sqlStock);
		sails.models.achats.query(sqlStock, function(err, results){
			logger.warn("le getstock : ", results);
			stb.push(results[0].total);
			callback(null, stb);	
		});			


  },
  getAllStock: function(callback) {
  	var sqlStock = "SELECT sum(a.qte) as ttl_stock, ";
  		sqlStock += "p.id as idp, ";
  		sqlStock += "p.nom as nom, ";
  		sqlStock += "p.id_type as id_typeproduit, ";
  		sqlStock += "p.icone as icone, ";
  		sqlStock += "r.nom as nom_rayon ";
  		sqlStock += "from achats a inner join produits p on p.id=a.id_produit ";
  		sqlStock += "inner join typesproduits r on r.id=p.id_type ";
  		sqlStock += "group by idp having sum(a.qte) > 0 order by nom asc";
  	logger.info(sqlStock);
	sails.models.achats.query(sqlStock, function(err, results){
		logger.warn("le getstock : ", results);
		if (err !== null && err !== undefined) return callback(err,null);	
		var tb = [];
		for (var c = 0; c < results.length; c++) {
			var stb = [];
			stb.push(results[c].idp);
			stb.push(results[c].nom);
			stb.push(results[c].ttl_stock);
			stb.push(results[c].id_typeproduit);
			stb.push(results[c].icone);
			stb.push(results[c].nom_rayon);
			
			tb.push(stb);
		}
		var objResult = {"data": null};
		objResult.data = tb;
		callback(null,objResult);
	});		

  },
  addStock: function(ins, callback) {
  	logger.info("ajout stock : ", ins);
	sails.models.achats.findOrCreate(ins,ins).exec(function creaStat(err,created){
		
		if(err !== null && err !== undefined) {
			return callback(err,null);
		} else 
			logger.util("created stock: ", created);
		//check total pour rester à stock > 0
		var sql = "SELECT sum( qte ) as ttl FROM achats WHERE id_produit =" + created.id_produit;
		logger.warn(sql);
		sails.models.achats.query(sql, function (err, result) {
			if(err !== null && err !== undefined) {
				logger.error(err);
			} else {
				if(result[0].ttl < 0) {
					var ajustement = result[0].ttl * -1;
					ins.qte = ajustement;
					ins.modifiedAt = moment().format("YYYY-MM-DD HH:mm:ss");
					ins.raison = 'remise à 0 aprés solde négatif';
					sails.models.achats.addStock(ins,function(err, crea2){
						
					});
				} else {
					return callback(null, created);
				}
			}
		});
		callback(null, created);	 
	});	

  }

  
};

