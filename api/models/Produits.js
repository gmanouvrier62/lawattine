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
    if (crit.nom !== null && crit.nom !== undefined) {
      tbCrit.push("nom like '%" + crit.nom + "%' "); 
    } 

    if(tbCrit.length > 0) {
      sql = "select * from  caisse.produits where " + tbCrit.join(" and ") + " order by nom asc";
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
  majFromCom: function(callback) {
    var apply = function calculPV(ht,txCom,tva) {
        ht = parseFloat(ht);
        txCom = parseFloat(txCom);
        tva = parseFloat(tva);

        var tt1 = ht +( (txCom*ht)/100 );
        var resultat = tt1 + ((tt1*tva)/100);
       
        return Math.round(resultat *100)/100;
    }

    this.find().exec(function(err,prds) {
      if(err !== null && err !== undefined) return callback(err, null);
      for(var c = 0; c < prds.length;c++) {
        logger.warn("id: ", prds[c].id, " vente actu : ", prds[c].ttc_vente, " recalc : ", apply(prds[c].pht, prds[c].tx_com, prds[c].tva));

      }
      callback(null, "OK");
    });




  }
};

