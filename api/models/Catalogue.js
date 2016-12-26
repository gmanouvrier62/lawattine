var logger = require('../services/logger.init.js').logger("tom.txt");
var moment = require('moment');

module.exports = {

  attributes: {

    id: { type: 'int' },

    nom: { type: 'string'},

    section: { type: 'string'},

    section_pos: { type: 'int'},

    settings: { type: 'string'},

    createdAt: {type: 'datetime'},
    updatedAt: {type: 'datetime'}

  }
  

  
};

