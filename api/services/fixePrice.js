var moment = require('moment');
var sleep = require('system-sleep');
var logger = require('../services/logger.init.js').logger("tom.txt");

module.exports = function(commande, callback){
	//Je prends les valeurs de chaque commande.produit et je remonte cette valeur qui ne bougera plus au niveau de cmp_pr
	logger.warn("je rentre ds fixeprice");
	logger.util(commande);
	
	var commande_id = commande.id;
	var compteur = 0;
	for (var c = 0; c < commande.produits.length; c++) {
		currP = commande.produits[c];
		logger.util("currp d'index " + c, currP);
		var index_ligne = currP.index_ligne;
		
		var cible = {
			id_cmd_pr: index_ligne,
			id_commande: commande_id,
		    id_produit: currP.id,
		    nom: currP.nom,
		    qte: currP.qte,
		    achat_ttc: currP.achat_ttc,
		    pu: currP.pu,
		    ttc: currP.ttc,
		    ref_interne: currP.ref_interne,
		    ref_externe: currP.ref_externe,
		    rayon: currP.rayon,
		    idr: currP.idr,
		    pht: currP.pht,
		    ttl_ht: currP.ttl_ht,
		    tx_com: currP.tx_com,
		    commission: currP.commission,
		    ttl_com: currP.ttl_com,
		    tx_tva: currP.tx_tva,
		    tva: currP.tva,
		    ttl_tva: currP.ttl_tva,
		    ttl_commande: commande.total_commande,
		    nb_articles: commande.ttlArticles,
		    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
		    updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
		};
		logger.util("la cible : ", cible);
		sails.models.historique.create(cible).exec(function creaStat(err,updated){
			logger.error(err);
			logger.warn("index compteru: ", compteur);
			if(err !== null && err !== undefined) return callback("Erreur d'ajout dans historique : " + err,  null);
			if(compteur == commande.produits.length-1) {
				return callback(null, commande);
			}
			logger.warn("toujours index compteru: ", compteur);

			compteur ++;
		});
	}
	
};

/*

produit.index_ligne = commandes[c].cp_index_ligne;
				produit.id = commandes[c].cpid;
        produit.nom = commandes[c].nom;
				produit.qte = commandes[c].qte;
        produit.qte_ok = commandes[c].qte_ok;
        ttlArticles += produit.qte;
       	produit.pu = commandes[c].puttc;
        produit.achat_ttc = commandes[c].achat_ttc;
        produit.ttc = parseInt((commandes[c].puttc * produit.qte) * 100)/100;
				produit.ref_interne = commandes[c].ref_interne;
				produit.ref_externe = commandes[c].ref_externe;
        produit.icone = commandes[c].icone;
				produit.rayon = commandes[c].rayon;
        produit.idr = commandes[c].idr;
        produit.pht = commandes[c].ht;
        produit.ttl_ht = parseInt((produit.pht * produit.qte) * 100) / 100;
        produit.tx_com = commandes[c].tx_com;
        produit.commission = parseInt((produit.pht * produit.tx_com)) / 100; //Comm unitaire
        produit.ttl_com = parseInt((produit.commission * produit.qte) * 100) / 100;//Comm totale
        //TODO : revoir les calculs 
        produit.tx_tva = commandes[c].tx_tva;
        produit.tva = parseInt(produit.pht * (produit.tx_tva / 100) * 100 )/100;
        produit.ttl_tva = parseInt(produit.tva * produit.qte * 100)/100;

*/