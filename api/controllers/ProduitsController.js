var fs = require('fs');
var util = require("util");
var moment = require('moment');
var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {
	

home : function (req, res) {
	/*
		var socket = req.socket;
		var io = sails.io;
	
		io.sockets.emit('messageName', {thisIs: 'thebeuebuebuessage'});
 	
 	 	logger.warn("coucouroucoucou");
   	var tom = menu.toString();
	*/

	var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
	return res.render ('produits/produits_list',{'action': 'produits', 'menu': menu});
},
getAll : function (req, res) {
	sails.models.produits.getAll(function(err,results) {
		var objResult = {"data": []};
		results.map(function(obj,idx) {
			var tb = [];
			tb.push(obj.id);
			tb.push(obj.nom.toString());
			tb.push(obj.id_type);
			tb.push(obj.ref_interne.toString());
			tb.push(obj.ref_externe.toString());
			tb.push(obj.ttc_externe);
			tb.push(obj.pht);
			tb.push(obj.tva);
			tb.push(obj.tx_com);
			tb.push(obj.ttc_vente);
			tb.push(obj.icone.toString());
			tb.push(obj.conditionnement.toString());
			
			objResult.data.push(tb);

		});
		logger.util(objResult);
		return res.send(objResult);
	});
}



 

};
