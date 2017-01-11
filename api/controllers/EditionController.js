var fs = require('fs');
var logger = require('../services/logger.init.js').logger("tom.txt");

module.exports = {

home: function(req, res) {
	var action = "edition";
	var id = "";
	var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
	
	if(req.params.act !== null && req.params.act !== undefined) {
		action = req.params.act;
	}
	
	return res.render ('edition/edition',{'action': action,'id': id, 'menu': menu});		
},
editer_catalogue: function(req, res) {
if(req.params.id !== null && req.params.id !== undefined) {
		id = req.params.id;
		action = "ajouter";
		var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
		return res.render ('edition/edition',{'action': action, 'id': id, 'menu': menu});	
		
	}
},
print: function(req, res) {
	var colRef = 4;
	if (req.body.edition !== null && req.body.content !== undefined) return res.send("Echec, pas de contenu");
	var catalogue = req.body.edition;
	logger.util("le catalogue print : ", catalogue);
	var template = fs.readFileSync(sails.config.template_catalogue).toString();
	template = template.replace("@@TITRE@@", catalogue.nom);
	var content = "";
	for(var c = 0; c < catalogue.sections.length; c++) {
		content += "<div style='height:40px;background-color:#F4C558;font-size:20px;font-weight:bold;text-align:center;border:1px solid black;background-color:#F4C558;margin-bottom:30px;margin-top:30px'>" + catalogue.sections[c].section + "</div><table>";
		
		var col = colRef;
		for(var cc = 0; cc < catalogue.sections[c].produits.length; cc++) {
			if(col == 0) {
    		 content += "</tr><tr><td colspan='" + colRef + "'></td></tr><tr>";
			 col = colRef;
			}
			col --;
			content += "<td><img style='width:100px;height:100px' src='http://localhost:800" + catalogue.sections[c].produits[cc].icone + "'></td>";
		}
		content += "</tr></table>";
	}
	template = template.replace("@@CONTENT@@", content);
	logger.warn("tpl : ", template);

	fs.writeFile("/var/impression/last_catalogue.html", template, function (err) {
    	if (err) {
    		logger.error(err);
    		return res.send(null);
    	}

    	return res.send(template);
    });
},
getFormatedCatalogue: function (req, res) {
	//formté pour la mise en place dans accordion 
	if(req.params.id !== null && req.params.id !== undefined) {
		id = req.params.id;
		sails.models.catalogue.get(id, function(err, results) {
			logger.util("affiche results : ", results);
			var tb = [];
			var memo = [];
			for(var c = 0; c < results.length; c++) {
				var s = results[c].section;
				if(memo.indexOf(s) <= -1) {
					logger.warn("memo[" ,s,"] est undefined");
					tb.push({'section': s, 'prds': []});
					memo.push(s);
					logger.util(memo);
				} else {
					logger.warn("memo[" ,s,"] est defined");
				}
				for(v = 0;v < tb.length; v++) {
						if(tb[v].section == s)
							tb[v].prds.push({'id': results[c].id, 'icone': results[c].icone});		
				}
				
			}
			//TODO suivre ce raisonnement pour afficher en ejs les differentes sections
			logger.util("tb : ", tb);
			logger.error("fin");
			res.send(tb);
		});
	}
},
getCatalogue: function (req, res) {
	logger.warn("dans GET, params id = ", req.params.id);
	if(req.params.id !== null && req.params.id !== undefined) {
		sails.models.catalogue.get(req.params.id, function(err, results) {
			logger.util(results);
			return res.send(results);
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
