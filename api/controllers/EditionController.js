var fs = require('fs');
var logger = require('../services/logger.init.js').logger("tom.txt");

module.exports = {

home: function(req, res) {
	var action = "edition";
	var id = "";
	if(req.params.act !== null && req.params.act !== undefined) {
		action = req.params.act;
	}
	if(req.params.id !== null && req.params.id !== undefined) {
		id = req.params.id;
		action = "ajouter";
	}
	var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
	return res.render ('edition/edition',{'action': action,'id': id, 'menu': menu});		
	
},
get: function (req, res) {
	if(req.params.id !== null && req.params.id !== undefined) {
		sails.models.catalogue.get(req.params.id, function(err, results) {
			logger.util(results);

		});

	} else {
		return res.send("Pas d'identifiant catalogue");
	}
},
getAll: function(req, res) {
	sails.models.catalogue.getAll(function(err,results) {
		var objResult = {"data": []};
		logger.util(results);
		if(results !== null) {
			results.map(function(obj,idx) {
				var tb = [];
				tb.push(obj.nom);
				objResult.data.push(tb);
			});
		}
		logger.util(objResult);
		return res.send(objResult);
	});
},
save: function (req, res) {
	var synchSave = function(cata, callback) {
		sails.models.catalogue.findOrCreate(cata,cata).exec(function creaStat(err,created){
					if(err !== null && err !== undefined) return callback(err, null);
				   	return callback(null, "OK");
					
				});
	}
	logger.warn("ben alors");
	var catal = req.body.catalogue;
	logger.util(catal);
	if (catal !== null && catal !== undefined) {
		var compteur = 0;
		for(var c = 0 ; c < catal.sections.length; c++) {
			for (var cc = 0 ; cc < catal.sections[c].produits.length; cc++) {
				var curP = catal.sections[c].produits[cc];
				var catalogue = {};
				catalogue.nom = catal.nom;
				catalogue.section = catal.sections[c].section;
				catalogue.section_pos = c+1;	
				catalogue.icone = curP.icone;
				catalogue.id_produit = curP.id;
				catalogue.settings="";
				logger.util(catalogue);
				synchSave(catalogue, function(err, result) {
					if(err !== null && err !== undefined) return res.send(err);
					compteur++;
					logger.warn(" cas ", compteur);
					if(catal.ttl == compteur) return res.send("OK");
				});
			}
		}
	}
}
};
