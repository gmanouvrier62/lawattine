var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {

  attributes: {

    id: { type: 'int' },

    id_client: { type: 'int'},

    status: { type: 'int' },

    dt_livraison: { type: 'datetime'}

  },

  getOneFullCommande: function(id_commande, id_client, callback) {
  	//Préparation de l'objet de retour
  	var fullCommande = {
  		client: null, 
  		id: null, 
  		status: null, 
  		dt_livraison: null, 
  		produits: [],
  		total_commande: 0

  	};
	  //rajouter nom, ref_interne et externe
  	var sql = "select c.id cid, st.nom_status cstatus, c.dt_livraison dt_livraison, cp.qte qte, ";
  		sql += "cp.id_produit cpid, cp.qte_ok qte_ok, cp.id cp_index_ligne, ";
  		sql += "p.ttc_vente puttc, p.ref_interne ref_interne, p.ref_externe ref_externe, p.nom nom, p.icone icone, ";
  		sql += "r.nom rayon, r.id idr ";
  		sql += " from commandes c inner join cmd_pr cp on c.id=cp.id_commande ";
  		sql += " inner join produits p on p.id=cp.id_produit ";
  		sql += " inner join typesproduits r on r.id=p.id_type ";
  		sql += " inner join status_commande st on st.id=c.status ";
  		sql += " where c.id=" + id_commande;
  		sql += " and c.id_client=" + id_client + " order by c.id";
    logger.warn(sql);
    sails.models.clients.find({"id": id_client}, function (err, clt) {
    	if (err !== null) return callback("pb de récupération client", null);
    	if (clt == null || clt == undefined) return callback("Le client n'existe pas", null);
    	fullCommande.client = clt[0];
    	sails.models.commandes.query(sql, function(err, commandes) {
			if (err !== null && err !== undefined)  return callback("pb de récupération des produits d'une commande", null);
			if (commandes == null || commandes == undefined) return callback("La commande est vide", null);			
			logger.warn("remplissage des produits : ", commandes.length);
			var ttlArticles = 0;
      for(var c = 0; c < commandes.length; c++) { 
				fullCommande.id = commandes[0].cid;
				fullCommande.status = commandes[0].cstatus;
				fullCommande.dt_livraison = commandes[0].dt_livraison;
				var produit = {};
				produit.index_ligne = commandes[c].cp_index_ligne;
				produit.id = commandes[c].cpid;
        produit.nom = commandes[c].nom;
				produit.qte = commandes[c].qte;
        ttlArticles += produit.qte;
       	produit.qte_ok = commandes[c].qte_ok;
				produit.pu = commandes[c].puttc;
				produit.ttc = parseInt((commandes[c].puttc * produit.qte) * 100)/100;
				produit.ref_interne = commandes[c].ref_interne;
				produit.ref_externe = commandes[c].ref_externe;
        produit.icone = commandes[c].icone;
				produit.rayon = commandes[c].rayon;
        produit.idr = commandes[c].idr;
				fullCommande.total_commande += produit.ttc;
        fullCommande.total_commande = parseInt(fullCommande.total_commande * 100)/100;
				fullCommande.produits.push(produit);
         
			}
      fullCommande.ttlArticles = ttlArticles;
			callback(null,fullCommande);
    	});
    });
 }
  
};

 