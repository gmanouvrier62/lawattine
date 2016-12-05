var logger = require('../services/logger.init.js').logger("tom.txt");
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
  	logger.info("le ins ", ins);
	sails.models.achats.findOrCreate(ins,ins).exec(function creaStat(err,created){
		
		if(err !== null && err !== undefined) {
			return callback(err,null);
		} else 
			logger.util("created : ", created);
		
		 callback(null, created);
	});	

  }

  
};

