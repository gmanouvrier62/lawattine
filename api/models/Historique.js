//Historique représnete une ligne commande/produit mémorisée au moment de la livraison pour la compta
//les chiffres ne doivent pas changer
var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {

  attributes: {
    id: { type: 'int' },
    id_cmd_pr: { type: 'int' },
    id_commande: { type: 'int'},
    id_produit: { type: 'int' },
    nom: {type: 'string'},
    qte: {type: 'int'},
    achat_ttc: {type: 'decimal'},
    pu: {type: 'decimal'},
    ttc: {type: 'decimal'},
    ref_interne: {type: 'string'},
    ref_externe: {type: 'string'},
    rayon: {type: 'string'},
    idr: {type: 'int'},
    pht: {type: 'decimal'},
    ttl_ht: {type: 'decimal'},
    tx_com: {type: 'decimal'},
    commission: {type: 'decimal'},
    ttl_com: {type: 'decimal'},
    tx_tva: {type: 'decimal'},
    tva: {type: 'decimal'},
    ttl_tva: {type: 'decimal'},
    ttl_commande: {type: 'decimal'},
    nb_articles: {type: 'int'},
    createdAt: {type: 'datetime'},
    updatedAt: {type: 'datetime'},
  },
  ventes_jour: function(d1,d2, callback) {
  	var sql = "select * from historique h inner join commandes c on ";
  		sql += "h.id_commande=c.id_commande inner join produits p on ";
  		sql += "p.id = h.id_produit where c.status = 4 and c.dt_livraison between '" + d1 + "' and ";
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
  
  