var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {

  attributes: {

    id : { type: 'int' },

    nom : { type: 'string' },

    adresse1 : { type: 'string'},

    adresse2 : { type: 'string' },

    cp : { type: 'string' },

    ville : { type: 'string' },

    tel : { type: 'string' },

    fax : { type: 'string' },
    
    mobile : { type: 'string' },

    email : { type: 'string' }
  },

  getAll: function(callback) {

    sql = "select * from  caisse.fournisseurs order by nom asc";
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

