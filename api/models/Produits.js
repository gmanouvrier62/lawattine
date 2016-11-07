var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {

  attributes: {

    id : { type: 'int' },

    nom : { type: 'string' },

    id_type : { type: 'string'},

    ref_interne : { type: 'sting' },

    ref_externe : { type: 'sting' },

    pht : { type: 'decimal' },

    tva : { type: 'decimal' },

    ttc_externe : { type: 'decimal' },

    tx_com : { type: 'decimal' },

    ttc_vente : { type: 'decimal' },

    icone : { type: 'string' },

    conditionnement : { type: 'string'}
  },

  getAll: function(callback) {

    sql = "select * from  caisse.produits order by nom asc";
    console.log("DANS MODEL : ", sql);
    
    this.query(sql,function creaStat(err,result){
      if(err != null) {
        logger.error("ATTENTION ! ", err);
        callback(err,null);
      } else {

        callback(null,result);
      }
    });

  }
  
};

