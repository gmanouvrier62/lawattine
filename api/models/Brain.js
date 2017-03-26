var logger = require('../services/logger.init.js').logger("tom.txt");
var moment = require('moment');

module.exports = {

  attributes: {

    id: { type: 'int' },

    id_produit: { type: 'int' },

    tape: {type: 'string'},

    createdAt: {type: 'datetime'}

  }
  
};

