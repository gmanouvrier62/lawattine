var logger = require('../services/logger.init.js').logger("tom.txt");
var moment = require('moment');
module.exports = {

  attributes: {

    id: { type: 'int' },

    id_client: { type: 'int'},

    status: { type: 'int' },

    paiement: { type: 'string'},

    dt_livraison: { type: 'datetime'}

  },
  arrondi: function(p) {
    var last = "";
    var step1 = parseInt(p * 100);
    step1 = step1.toString();
    var tb = [];
    for(var c = 0; c < step1.length; c++) tb.push(step1[c]);

    if(tb[tb.length-1] == 1 || tb[tb.length-1] == 2) tb[tb.length-1] = 0;
    if(tb[tb.length-1] == 3 || tb[tb.length-1] == 4 || tb[tb.length-1] == 6) tb[tb.length-1] = 5;
    if(tb[tb.length-1] == 7 || tb[tb.length-1] == 8 || tb[tb.length-1] == 9) {
      //Attention dans ce cas il faut ajouter 1 au regroupement du tableau
      //pour la problématique d'ajout d'une dizaine
      var tmp = parseInt(tb.join(""));
      logger.warn('avant calcul ', tmp);
      var offset = 10 - tb[tb.length-1];
      tmp += offset;
      step1 = tmp.toString();
      logger.warn("1299 + 1", step1);
      tb = [];
      for(var c = 0; c < step1.length; c++) tb.push(step1[c]);
      
    } 
    var resultat = tb.join("");
    return parseInt(resultat) / 100;
  },
  getCommandes: function(req, callback) {
         
    var status = null;
    var dtDebut = null;
    var dtFin = null;
    var id_client = null;
    var tbCritere = [];
    if(req.body !== null && req.body !== undefined) {
      if (req.body.status !== null && req.body.status !== undefined)
        tbCritere.push("st.id in (" + req.body.status.join(',') + ")");
      if (req.body.id_client !== null && req.body.id_client !== undefined && req.body.id_client > 0)
        tbCritere.push("id_client = " + req.body.id_client);
      if (req.body.dtDebut !== null && req.body.dtDebut != undefined) {
        if(req.body.dtFin !== null && req.body.dtFin !== undefined)
          tbCritere.push("dt_livraison between '" + req.body.dtDebut + " 00:00:00' and '" + req.body.dtFin + " 23:59:59'");
        else
          tbCritere.push("dt_livraison between '" + req.body.dtDebut + " 00:00:00' and '" + req.body.dtDebut + " 23:59:59'");
      }
    }
    //cas d'un passage en :id_client
    /*
    if(req.params !== null && req.params !== undefined) {
      if(req.params.id_client !== null && req.params.id_client !== undefined)
        tbCritere.push("id_client = " + req.params.id_client);
    }
    */
    logger.warn("crits : ", tbCritere);
    var sql = "select c.id as idc, ";
      sql += "c.status as id_status, ";
      sql += "st.nom_status as nom_status, ";
      sql += "clt.id as id_client, ";
      sql += "clt.nom as nom, ";
      sql += "clt.prenom as prenom, ";
      sql += "clt.tel as tel, ";
      sql += "clt.mobile as mobile, ";
      sql += "clt.adresse as adresse, ";
      sql += "clt.cp as cp, ";
      sql += "clt.ville as ville, ";
      sql += "c.dt_livraison dt_livraison from commandes c ";
      sql += "inner join clients clt on c.id_client = clt.id ";
      sql += "inner join status_commande st on st.id = c.status where ";
      sql += tbCritere.join(' and ');

    logger.warn('go requete: ', sql);
    sails.models.commandes.query(sql, function(err, datas){
      if (err !== null && err !== undefined) return callback(err, null);
      var retour = [];
      for (var c = 0; c < datas.length; c++) {
        var ligne = [];
        ligne.push(datas[c].idc);
        ligne.push(datas[c].id_status);
        ligne.push(datas[c].nom_status);
        ligne.push(datas[c].nom);
        ligne.push(datas[c].prenom);
        ligne.push(datas[c].tel);
        ligne.push(datas[c].mobile);
        ligne.push(datas[c].adresse);
        ligne.push(datas[c].cp);
        ligne.push(datas[c].ville);
        ligne.push(moment(datas[c].dt_livraison).format("DD-MM-YYYY"));
        ligne.push(datas[c].id_client);
        retour.push(ligne);
      }
      logger.warn('avant cback nb commande: ', retour.length);
      callback(null, retour);

    });
  },
  getOneFullCommandeHistorique: function (id_commande, id_client, callback) {
    //Préparation de l'objet de retour
    var fullCommande = {
      client: null, 
      id: null, 
      status: null, 
      dt_livraison: null, 
      produits: [],
      total_commande: 0
    };
    var sql = "select * from historique h inner join produits prd on h.id_produit=prd.id inner join commandes c on c.id=h.id_commande inner join status_commande sc on sc.id=c.status where id_commande=" + id_commande;
    logger.warn(sql);
    sails.models.clients.find({"id": id_client}, function (err, clt) {
      if (err !== null) return callback("pb de récupération client", null);
      if (clt == null || clt == undefined) return callback("Le client n'existe pas", null);
      fullCommande.client = clt[0];
      sails.models.commandes.query(sql, function(err, commandes) {
        if (err !== null && err !== undefined)  return callback("pb de récupération des produits d'une commande", null);
        if (commandes == null || commandes == undefined) return callback("La commande est vide", null);     
        logger.warn("remplissage des produits : ", commandes.length);
        if(commandes.length > 0) {
          var ttlArticles = 0;
          for(var c = 0; c < commandes.length; c++) { 
            fullCommande.id = commandes[0].id_commande;
            fullCommande.status = commandes[0].nom_status;
            fullCommande.dt_livraison = commandes[0].dt_livraison;
            fullCommande.paiement = commandes[0].paiement;
            var produit = {};
            produit.index_ligne = commandes[c].id_cmd_pr;
            produit.id = commandes[c].id_produit;
            produit.nom = commandes[c].nom;
            produit.qte = commandes[c].qte;
            produit.qte_ok = 0;
            ttlArticles += produit.qte;
            produit.pu = commandes[c].pu;
            produit.achat_ttc = commandes[c].achat_ttc;
            produit.ttc = parseInt((commandes[c].pu * produit.qte) * 100)/100;
            produit.ref_interne = commandes[c].ref_interne;
            produit.ref_externe = commandes[c].ref_externe;
            produit.icone = commandes[c].icone;
            produit.rayon = commandes[c].rayon;
            produit.idr = commandes[c].idr;
            produit.pht = commandes[c].pht;
            //produit.ttl_ht = parseInt((produit.pht * produit.qte) * 100) / 100;
            produit.ttl_ht = commandes[c].ttl_ht;
            produit.tx_com = commandes[c].tx_com;
            //produit.commission = parseInt((produit.pht * produit.tx_com)) / 100; //Comm unitaire
            produit.commission = commandes[c].commission;
            //produit.ttl_com = parseInt((produit.commission * produit.qte) * 100) / 100;//Comm totale
            produit.ttl_com = commandes[c].ttl_com;
            produit.tx_tva = commandes[c].tx_tva;
            //produit.tva = parseInt(produit.pht * (produit.tx_tva / 100) * 100 )/100;
            produit.tva = commandes[c].tva;
            //produit.ttl_tva = parseInt(produit.tva * produit.qte * 100)/100;
            produit.ttl_tva = commandes[c].ttl_tva;

            fullCommande.produits.push(produit);
          }
          fullCommande.ttlArticles = ttlArticles;
          logger.util(commandes[0]);
          fullCommande.total_commande = commandes[0].ttl_commande;
          logger.warn('ready to back histo');
        }
        callback(null,fullCommande);
      });

    });

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
  	var sql = "select c.id cid, st.nom_status cstatus, c.dt_livraison dt_livraison, c.paiement paiement, cp.qte qte, ";
  		sql += "cp.id_produit cpid, cp.qte_ok qte_ok, cp.id cp_index_ligne, ";
  		sql += "p.ttc_vente puttc, ";
      sql += "p.ttc_externe achat_ttc, ";
      sql += "p.ref_interne ref_interne, ";
      sql += "p.ref_externe ref_externe, ";
      sql += "p.nom nom, ";
      sql += "p.icone icone, ";
      sql += "p.pht ht, ";
      sql += "p.tx_com tx_com, ";
      sql += "p.tva tx_tva, ";
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
        fullCommande.paiement = commandes[0].paiement;
				var produit = {};
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
        logger.warn ("le ht+com=", (produit.pht / (1-(produit.tx_com / 100))));
        logger.warn("le ht = ", produit.pht);
        logger.warn("rien que la com=",(produit.pht / (1-(produit.tx_com / 100))) - produit.pht);
        produit.commission = (produit.pht / (1-(produit.tx_com / 100))) - produit.pht; //Comm unitaire
        produit.ttl_com = parseInt((produit.commission * produit.qte) * 100) / 100;//Comm totale
        //TODO : revoir les calculs 
        produit.tx_tva = commandes[c].tx_tva;
        produit.tva = parseInt(produit.pht * (produit.tx_tva / 100) * 100 )/100;
        produit.ttl_tva = parseInt(produit.tva * produit.qte * 100)/100;
        
				fullCommande.total_commande += produit.ttc;
        fullCommande.total_commande = parseInt(fullCommande.total_commande * 100)/100;
				fullCommande.produits.push(produit);
         
			}
      fullCommande.ttlArticles = ttlArticles;
      logger.warn('ready to back');
      logger.error("fullCommande ", fullCommande.produits);
      fullCommande.total_commande = sails.models.commandes.arrondi(fullCommande.total_commande);
			callback(null,fullCommande);
    	});
    });
 }
  
};

 