var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {

  attributes: {

    id: { type: 'int' },

    id_commande: { type: 'int'},

    id_produit: { type: 'int' },

    qte: {type: 'int'},

    qte_ok: {type: 'int'}

  }

  
};

