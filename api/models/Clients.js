var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {

  attributes: {

    id : { type: 'int' },

    civ: { type: 'string'},

    nom : { type: 'string' },

    prenom : { type: 'string'},

    adresse : { type: 'string' },

    cp : { type: 'string' },

    ville : { type: 'string' },

    tel : { type: 'string' },

    mobile : { type: 'string' },

    email : { type: 'string' },

    current_debit: { type: 'decimal'},

    current_avoir: { type: 'decimal'}
  },

  getAll: function(callback) {

    sql = "select * from  caisse.clients order by nom asc";
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

