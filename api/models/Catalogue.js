var logger = require('../services/logger.init.js').logger("tom.txt");
var moment = require('moment');

module.exports = {

  attributes: {

    id: { type: 'int' },
    id_produit: { type: 'int' },
    icone: { type: 'string'},
    nom: { type: 'string'},

    section: { type: 'string'},

    section_pos: { type: 'int'},

    settings: { type: 'string'},

    createdAt: {type: 'datetime'},
    updatedAt: {type: 'datetime'}

  },
  get: function(id, callback) {
    var sql = "select * from caisse.catalogue where nom = " + id + " order by section_pos";
    this.query(sql, function recup(err, results) {
        if(err !== null && err !== undefined) return callback(err, null);
        logger.util("get catalogue : ", results);
        for(var c = 0; c < results.length; c++) {
            
        }
    });    
  },
  getAll: function(callback) {
    sql = "select distinct nom from  caisse.catalogue order by id desc";
    console.log("DANS MODEL : ", sql);
    
    this.query(sql, function creaStat(err,result){
      if(err != null) {
        logger.error("ATTENTION ! ", err);
        callback(err,null);
      } else {
        callback(null,result);
      }
    });
  }
  

  
};

