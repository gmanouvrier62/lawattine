var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {

  attributes: {

    id: { type: 'int' },

    id_commande: { type: 'int'},

    id_produit: { type: 'int' },

    qte: {type: 'int'},
    qte_ok: {type: 'int'},
    histo_qte: {type: 'int'},
    
    tva: {type: 'decimal'},
    histo_tva_total: {type: 'decimal'},
    
    pht: {type: 'decimal'},
    histo_pht_total: {type: 'decimal'},

    tx_com: {type: 'decimal'},
        
    ttc_externe: {type: 'decimal'},
    ttc_vente: {type: 'decimal'}

  },
  ventes_jour: function(d1,d2, callback) {

    //A REVOIR PB On ne doit pas regarder dans la table produit mais se baser sur les prix de cmd_pr 
    //car ils restent fixes
  	var sql = "select * from cmd_pr cp inner join commandes c on ";
  		sql += "c.id=cp.id_commande inner join produits p on ";
  		sql += "p.id = cp.id_produit where c.status = 4 and c.dt_livraison between '" + d1 + "' and ";
  		sql += "'" + d2 + "' order by id_client";
  	logger.warn("sql : " + sql);
  	this.query(sql, function(err,results) {
  		if (err !== null && err !== undefined) {
  			callback(err,null);
  		} else {
  			callback(null,results);
  		}
  	});
  }
};

