var logger = require('../services/logger.init.js').logger("tom.txt");
var moment = require('moment');
module.exports = {

  attributes: {

    id: { type: 'int' },

    position: { type: 'int'},

    id_client: { type: 'int'},

    status: { type: 'int' },

    paiement: { type: 'string'},

    dt_paiement: { type: 'string'},

    dt_livraison: { type: 'datetime'}, 

    createdAt: { type: 'datetime'},

    updatedAt: { type: 'datetime'}

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
  getOneFullCommande: function(id_commande, id_client, callback) {
  	var roundDecimal = function(nombre, precision){
      var precision = precision || 2;
      var tmp = Math.pow(10, precision);
      return Math.round( nombre*tmp )/tmp;
    }
    //Préparation de l'objet de retour
  	var objTVA = {
    '5.5': 0,
    '10': 0,
    '20': 0
    };
    var fullCommande = {
  		client: null, 
  		id: null, 
  		status: null, 
  		dt_livraison: null, 
  		produits: [],
      total_ht: 0.00,
      total_tva: objTVA,
  		total_commande: 0.00

  	};
    logger.warn("!debut fct : ", fullCommande.total_tva['5.5']);
        
	  //rajouter nom, ref_interne et externe
  	var sql = "select c.id cid, st.nom_status cstatus, c.dt_livraison dt_livraison, c.createdAt dt_creation,  c.paiement paiement, cp.qte qte, c.dt_paiement, c.position, ";
  		sql += "cp.id_produit cpid, cp.qte_ok qte_ok, cp.id cp_index_ligne, ";
  		sql += "cp.ttc_vente puttc, ";
      sql += "cp.ttc_externe achat_ttc, ";
      sql += "p.ref_interne ref_interne, ";
      sql += "p.ref_externe ref_externe, ";
      sql += "p.nom nom, ";
      sql += "p.icone icone, ";
      sql += "cp.pht ht, ";
      sql += "cp.tx_com tx_com, ";
      sql += "cp.tva tx_tva, ";
  		sql += "r.nom rayon, r.id idr ";
  		sql += " from commandes c inner join cmd_pr cp on c.id=cp.id_commande ";
  		sql += " inner join produits p on p.id=cp.id_produit ";
  		sql += " inner join typesproduits r on r.id=p.id_type ";
  		sql += " inner join status_commande st on st.id=c.status ";
  		sql += " where c.id=" + id_commande;
  		sql += " and c.id_client=" + id_client + " order by c.id";
    logger.warn(sql);
    sails.models.clients.find({"id": id_client}, function (err, clt) {
    	logger.warn("!debut client : ", id_client, "  = ", fullCommande.total_tva['5.5']);
       
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
          fullCommande.dt_paiement = commandes[0].dt_paiement;
          fullCommande.position = commandes[0].position;
          fullCommande.dt_creation = commandes[0].dt_creation;
  				var produit = {};
  				produit.index_ligne = commandes[c].cp_index_ligne;
  				produit.id = commandes[c].cpid;
          produit.nom = commandes[c].nom;
  				produit.qte = commandes[c].qte;
          produit.qte_ok = commandes[c].qte_ok;
          produit.tx_tva = commandes[c].tx_tva;
          ttlArticles += produit.qte;
         	produit.pu = roundDecimal(commandes[c].puttc,2);
          produit.achat_ttc = commandes[c].achat_ttc;
          produit.ttc = roundDecimal(commandes[c].puttc * produit.qte,2);
  				
          produit.ttl_ht = roundDecimal(produit.ttc / (1 + produit.tx_tva/100),4);
          produit.ref_interne = commandes[c].ref_interne;
  				produit.ref_externe = commandes[c].ref_externe;
          produit.icone = commandes[c].icone;
  				produit.rayon = commandes[c].rayon;
          produit.idr = commandes[c].idr;
          produit.pht = commandes[c].ht;//achat
          var coeffCom = (100 - commandes[c].tx_com) / 100;
          logger.warn("coeffcom : ", coeffCom);
          produit.client_ht = parseInt((produit.pht / coeffCom) * 100)/100;
          produit.tx_com = commandes[c].tx_com;
          //TODO A checker par precaution avec Christophe
          logger.error("client_ht : ", produit.client_ht);
          logger.error("ht : ", produit.pht);
          logger.error("soutract client_ht-pht= ", produit.client_ht - produit.pht);
          produit.commission = produit.client_ht - produit.pht;
          produit.ttl_com = produit.commission * produit.qte;//Comm totale
          produit.ttl_com = roundDecimal(produit.ttl_com,2);
         
          produit.tva = produit.client_ht * (produit.tx_tva / 100);
           
          produit.ttl_tva = produit.tva * produit.qte;
          logger.error("produit ", produit.nom, " : ", produit.tva, " ttl : ", produit.ttl_tva);    
  				fullCommande.total_commande += produit.ttc;
          fullCommande.total_commande = roundDecimal(fullCommande.total_commande, 2);
         
          fullCommande.total_ht += produit.ttl_ht;
          fullCommande.total_ht = roundDecimal(fullCommande.total_ht, 2);
          
          fullCommande.total_tva[produit.tx_tva.toString()] += produit.ttl_tva;
          fullCommande.total_tva[produit.tx_tva.toString()] = roundDecimal(fullCommande.total_tva[produit.tx_tva.toString()], 2);

          fullCommande.produits.push(produit);
           
  			}
        fullCommande.ttlArticles = ttlArticles;
        fullCommande.total_ht = roundDecimal(fullCommande.total_ht, 2);
        logger.warn('ready to back');
        logger.error("fullCommande final", fullCommande.produits);
        //fullCommande.total_commande = sails.models.commandes.arrondi(fullCommande.total_commande);
  			callback(null,fullCommande);
      });
    });
 },
 valider: function(id_commande, id_client, callback) {
    var origine = {
      'id': id_commande,
      'id_client': id_client
    };
    var target = {
      'id': id_commande,
      'id_client': id_client,
      'status': 2
      //'paiement': req.body.paiement,
      //'dt_paiement': req.body.dt_paiement
    };
    logger.warn('avant update');
    sails.models.commandes.update(origine, target).exec(function (err, updated) {
      if (err !== null && err !== undefined){
       logger.error(err);
       return callback("Erreur de mise à jur de commande : " + err, null);
      }
      callback(null,"OK");
    });

 },
 undo: function(id_commande, callback) {
    if(id_commande === null || id_commande === undefined || parseInt(id_commande)<=0 ) return callback("erreur pas de commande", null);
    var origine = {
      'id': id_commande
    };
    var target = {
      'id': id_commande,
      'status': 1
    };
    sails.models.commandes.update(origine, target).exec(function (err, updated) {
      if (err !== null && err !== undefined){
       logger.error(err);
       return callback("Erreur de mise à jour de commande : " + err, null);
      }
      callback(null,"OK");
    });

 }
  
};

 