var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {

  attributes: {

    id: { type: 'int' },

    id_produit: { type: 'int'},

    nom1: { type: 'string' },

    nom2: { type: 'string'},

    ttc: { type: 'decimal' },

    qte_dispo: { type: 'int'}

  }

  
};

