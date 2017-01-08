var logger = require('../services/logger.init.js').logger("tom.txt");
var moment = require('moment');

module.exports = {

  attributes: {

    id: { type: 'int' },

    id_catalogue: { type: 'int' },

    id_produit: { type: 'int' },
    section: { type: 'string'},

    createdAt: { type: 'datetime'},
    updatedAt: { type: 'datetime'}

  }
  

  
};

