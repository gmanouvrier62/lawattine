/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var logger = require('../services/logger.init.js').logger("tom.txt");
var moment = require("moment");
var sleep = require("system-sleep");
module.exports = {
	home: function (req, res) {
		function checkFolder(chemin) {
			var tb = chemin.split('/');
			var toCheck = "";
			for(var c = 0; c < tb.length; c++) {
				toCheck += tb[c] + '/';
				fs.mkdir(toCheck,function(e){
				    if(!e || (e && e.code === 'EEXIST')){
				        //do something with contents
				    } else {
					    fs.mkdirSync(toCheck,0777);
				    }
				});
			}
			return toCheck;
		};
		//pad(5,val,'0')
		function pad(width, string, padding) { 
		  return (width <= string.length) ? string : pad(width, padding + string, padding)
		}
		var tom ="";
		sails.models.commandes.find({'id':req.body.id_commande}).exec(function(err, commandes) {
			if (err !== null && err !== undefined) return res.send({'err': err, 'link':null});
			var commande = commandes[0];
			logger.util("commandes ", commandes);
			var folderDay = moment(commande.createdAt).format("YYYY/MM/DD");
			var fullFolderDay = checkFolder(sails.config.archive_facture + folderDay);
			var filename = "id_" + req.body.id_commande+ "_" + moment(commande.createdAt).format("YYYYMMDD") + pad(5,commande.position,'0') + ".html";
			var chemin = fullFolderDay + filename;
			try {
			    fs.statSync(chemin);
			    var content = fs.readFileSync(chemin).toString();
			    logger.warn(process.cwd());
			    fs.writeFile(process.cwd() + "/assets/images/tmp/" + filename, content, function(err) {
				    if(err) return res.send({'err': "pas d'écriture de  " + "/images/tmp/" + filename , 'link':null});
				    sleep.sleep(2);
				    return res.send({'err': null, 'link': "/images/tmp/" + filename});
				    console.log("The file was saved!");
				}); 
			} catch(err) {
			    if(err.code == 'ENOENT') return res.send({'err': "lz fichier " + chemin + " est injoignable", 'link':null});
			}

		});

		//var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
		//return res.render ('factures/view',{'action': 'achats', 'menu': menu});
		
	},
	afficher: function(req, res) {

	}
};

