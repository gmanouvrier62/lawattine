var request = require('request');
var fs = require('fs');
var util = require("util");
var moment = require('moment');
var sleep = require('sleep');
var cheerio = require('cheerio');
var Entities = require('html-entities').XmlEntities; 
var Immutable = require('immutable');
var mkdirp = require('mkdirp');
var logger = require('../services/logger.init.js').logger("tom.txt");
var rep_base = sails.config.importProductsFolder;

module.exports = function(sck,callback){
	var lesurl = "";
    var ttlFiles = sails.config.tbPromos.length;
    if (sails.config.tbPromos == null || sails.config.tbPromos == undefined) return callback("pas de promos en config");
	if (sails.config.tbPromos.length <= 0) return callback("pas de promos");

    var cptFile = 0;
	sck.sockets.emit("importations");
	for (cc = 0; cc < sails.config.tbPromos.length; cc++) {
		var filename = sails.config.importProductsFolder + 'Promos_' + cc;
		contenu = JSON.parse(fs.readFileSync(filename, "UTF-8"));
		var produits = contenu.objContenu.lstElements;
    	for(var cpt = 0 ; cpt < produits.length;cpt++) {
    		tom ++;
    		var ref_prod = produits[cpt].objElement.iIdProduit.toString();	
    		var origine = {'ref_externe': ref_prod};
    		var cible = {'promo': cc +1};//1=promo_0, 2=promo_1
    		sails.models.produits.update(origine, cible).exec(function(err, updated) {
    			if (err !== null && err !== undefined) {
    				logger.error("pb update promo : ", err);
    				lesurl += err + '\r\n';
    			}
    			if( (this.cptFile == ttlFiles-1) && (this.cpt == (produits.length -1))) {
					sck.sockets.emit("fin_importations");
					callback(lesurl);
				} 
    		}.bind({'cpt': cpt,'cptFile': cptFile}));
    	}
    	cptFile++;
	}
};

