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
  }
};

