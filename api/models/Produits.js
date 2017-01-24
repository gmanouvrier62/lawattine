var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {

  attributes: {

    id: { type: 'int' },

    id_fournisseur: { type: 'int'},

    nom: { type: 'string' },

    id_type: { type: 'string'},

    ref_interne: { type: 'string' },

    ref_externe: { type: 'string' },

    pht: { type: 'decimal' },

    tva: { type: 'decimal' },

    ttc_externe: { type: 'decimal' },

    tx_com: { type: 'decimal' },

    ttc_vente: { type: 'decimal' },

    icone: { type: 'string' },

    conditionnement: { type: 'string'},

    qte_dispo: { type: 'int'},

    disponibilite: { type: 'int' }    
  },

  getAll: function(idType, callback) {
    if(idType == "" || idType == null || idType == undefined || idType == "0")
      sql = "select * from  caisse.produits order by nom asc";
    else
      sql = "select * from  caisse.produits where id_type='" + idType + "' order by nom asc";
    console.log("DANS MODEL : ", sql);
    
    this.query(sql, function creaStat(err,result){
      if(err != null) {
        logger.error("ATTENTION ! ", err);
        callback(err,null);
      } else {
        callback(null,result);
      }
    });
  },
  getDistinctProductsByClient: function(id_client, callback) {
    if(id_client == null && id_client == undefined) return callback("pas de id_client",null);
    var sql = "SELECT distinct p.* FROM produits p inner join cmd_pr cp on p.id=cp.id_produit ";
        sql += " inner join commandes cmd on cmd.id = cp.id_commande ";
        sql += " inner join clients clt on clt.id=cmd.id_client ";
        sql += " where cmd.id_client=" + id_client;

    this.query(sql, function getPrds(err, result) {
      if(err != null) {
        logger.error("ATTENTION ! ", err);
        callback(err,null);
      } else {
        callback(null,result);
      }
    });

  },
  getRayonFromCom: function(txCom,tb,  callback) {
    var sql = " select t.nom as rayon from produits p inner join typesproduits t on p.id_type=t.id where tx_com=" + txCom;
    this.query(sql, function(err, resultat) {
      if(err !== null && err !== undefined) {
        callback(err, null);
      } else {
        var les_rayons = [];
        for(var c = 0 ; c < resultat.length; c++) {
          les_rayons.push(resultat[c].rayon);
        }
        tb.push(les_rayons);
        callback(null, tb);
      }
    });
  },
  getAllCrit: function(crit, callback) {
    var tbCrit = [];
    var extra = "";
    if (crit.nom !== null && crit.nom !== undefined) {
      tbCrit.push("nom like '" + crit.nom + "%' "); 
      extra = " UNION select * from  caisse.produits where nom like '%" + crit.nom + "%' ";
    } 

    if(tbCrit.length > 0) {
      sql = "select * from  caisse.produits where " + tbCrit.join(" and ") + extra;
      console.log("DANS MODEL : ", sql);
      
      this.query(sql, function creaStat(err,result){
        if(err != null) {
          logger.error("ATTENTION ! ", err);
          callback(err,null);
        } else {
          callback(null,result);
        }
      });
    } else {
      callback(null,result);
    }
  },
  majPrix: function(callback) {
      sql = "update produits set ttc_vente = ROUND((pht / ( 1 - (tx_com/100) )) * ( 1 + tva /100 ),2)";
      logger.warn(sql);
      
      this.query(sql, function(err, pertinents) {
        if(err !== null && err !== undefined) {
          logger.error("erreur : ", err);
          return callback(err,null);
        }
        logger.warn("OK majPrix effectuée");
        return callback(null,"OK");
      });
  },
  majFromCom: function(criteres, callback) {
    var ccc = 0;
    for (var rg = 0; rg < criteres.ranges.length; rg++) {
      logger.util ("range courrant : ", criteres.ranges[rg]);
      var min = criteres.ranges[rg].min;
      var max = criteres.ranges[rg].max;
      var tx = criteres.ranges[rg].tx;
      logger.warn(criteres);
      if(criteres.rayons === null || criteres.rayons === undefined) {
        criteres.rayons = [];
      }
      if(criteres.rayons.length > 0) {
        sql = "update produits set tx_com = " + tx + ", ttc_vente = ROUND((pht / ( 1 -(" + tx + "/100))) * ( 1 + tva /100 ),2)";
        sql +=" where id_type in(" + criteres.rayons.join(",") + ") and pht >=" + min + " and pht<=" + max;
      } else {
        sql = "update produits set tx_com = " + tx + ", ttc_vente = ROUND((pht / ( 1 -(" + tx + "/100))) * ( 1 + tva /100 ),2)";
        sql+= " where pht >=" + min + " and pht<=" + max;
      }
      logger.warn(sql);
      
      this.query(sql, function(err, pertinents) {
        if(err !== null && err !== undefined) {
          logger.error("erreur : ", err);
          return callback(err,null);
        }
        if(ccc == criteres.ranges.length-1) {
          logger.warn("majour prix ok");
          return callback(null,"OK");
        }
        ccc++;
      });
    }
  }
};

