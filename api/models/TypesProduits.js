/**
* TypesProduits.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    id : { type: 'int,' },

    nom : { type: 'string' }
  },
   getAll: function(callback) {

    sql = "SELECT id, nom FROM `typesproduits` where id in (select typesproduits.id from typesproduits inner join produits on produits.id_type=typesproduits.id) order by nom";
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

