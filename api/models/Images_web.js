var logger = require('../services/logger.init.js').logger("tom.txt");
var moment = require('moment');

module.exports = {

  attributes: {

    id: { type: 'int'},

    id_produit: { type: 'int'},

    id_type: {type: 'int'},

    id_vignette: { type: 'int'},

    url: {type: 'string'},

    status: {type: 'int'},

    createdAt: {type: 'datetime'},

	  updatedAt: {type: 'datetime'}

  },
  setStatus: function(id,status, callback) {
    var sql = "update caisse.images_web set status=" + status + " where id=" + id;
    this.query(sql, function(err, results) {
      if (err !== null && err !== undefined) return callback (err, null);
      return callback(null, true);
    });
  }
};

