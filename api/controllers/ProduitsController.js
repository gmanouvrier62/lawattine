var fs = require('fs');
var util = require("util");
var moment = require('moment');
var logger = require('../services/logger.init.js').logger("tom.txt");
var sleep = require("sleep");
var mkdirp = require('mkdirp');
var path = require('path');
var formidable = require('formidable');

var importeur = require("../services/importeur.js"); 
//Penser à supprimer createJson
module.exports = {

	home: function (req, res) {
		/*
			var socket = req.socket;
			var io = sails.io;
		
			io.sockets.emit('messageName', {thisIs: 'thebeuebuebuessage'});
	 	
	 	 	logger.warn("coucouroucoucou");
	   	var tom = menu.toString();
		*/
		var letype = "0";
		if (req.params.id !== undefined && req.params.id !== null)
			letype = req.params.id;
		else
			letype = 284358;
		var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
		return res.render ('produits/produits_list',{'action': 'produits', 'menu': menu, 'memoType':letype});
	},
	marge: function(req, res) {
		sql = "select distinct cl.nom nom, cl.id id_client,  dt_livraison, ttl_commande, c.id idc from historique h inner join commandes c on h.id_commande=c.id ";
		sql += " inner join clients cl on cl.id=c.id_client where c.status=4 order by c.dt_livraison desc limit 7";
		logger.warn("sql : ", sql);
		sails.models.historique.query(sql, function(errh, histos){
			if(errh !== null && errh !== undefined) {
				logger.error("Erreur de récupérations d'historiques");
			}
			for(var c = 0; c < histos.length; c++)
				histos[c].dt_livraison = moment(histos[c].dt_livraison).format("DD-MM-YYYY");
			sails.models.typesproduits.getAll(function(err,results) {
				if (err !== null && err !== undefined) {
					logger.error("Erreur de récupération des rayons");
				}

				var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
				return res.render ('produits/marge',{'action': 'marge', 'rayons': results,'commandes':histos, 'menu': menu});

			});
		});
		
	},
	apply_com: function(req, res) {
		if(req.body.datas !== null && req.body.datas !== undefined) {
			sails.models.produits.majFromCom(req.body.datas, function(err, results) {
				res.send(results);
			});
		} else {
			res.send("Aucunes mise à jour, pas de critères établis");
		}
	},
	import: function (req, res) {
		
		//importProduits(function(result) {

		//	return res.send(result);
		//});
		
			
	},
	prepare_import_json: function(req, res) {
		

		var imp = new importeur();
		imp.getNext();
		imp.on("pasbon", function(){
			logger.warn("catch error1", imp.currentLink, " pointeur ", this.pointeur);
			imp.getNext();
		});
		
		imp.on("completed", function(){
			logger.warn("fini pour ", imp.currentLink, " pointeur ", this.pointeur);
			imp.getNext();
		});
		imp.on("all_completed", function(){
			//voir pour un socketio 
			logger.warn("oki all finished");
		});
		var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
		return res.render ('produits/import',{'action': 'import', 'menu': menu});

	},
	import_rayon_json: function(req, res) {

		

	},
	repartition_com: function(req, res) {
		logger.warn('DANS REPARTITION');
		var sql = "select count(*) as ttl, tx_com from produits group by tx_com";
		sails.models.produits.query(sql, function(err, results){
			if (err !== null & err !== undefined) {
				logger.error(err);
				return res.send("");
				
			} else {
				var objResult = {"data": []};
				var cpt = 0;
				results.map(function(obj,idx) {
					var tb = [];
					tb.push(obj.ttl);
					tb.push(obj.tx_com);
					objResult.data.push(tb);
					/*
					sails.models.produits.getRayonFromCom(obj.tx_com, tb, function(err, retour) {
						if(err !== null && err !== undefined) {
							logger.error("erreur : ", err);
							return res.send(null);
						} 
						logger.util(" obj result : ", retour);
						objResult.data.push(retour);
						if(idx == results.length -1){
							logger.warn("va retourner le resultat");
							return res.send(objResult);
						}
						cpt++;
					});
					*/
				});
				return res.send(objResult);
			}
		});
	},
	getAllCrit: function(req, res) {
		sails.models.produits.getAllCrit({'nom': req.params.nom}, function(err,results) {
			if (results !== null) {
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
					if(obj.conditionnement !== null)
						tb.push(obj.conditionnement.toString());
					else
						tb.push(obj.conditionnement);
					tb.push(obj.disponibilite);
					objResult.data.push(tb);

				});
				logger.util(objResult);
				return res.send(objResult);
			} else {
				return res.send("");
			}
			
		});
	},
	getAll: function (req, res) {
		sails.models.produits.getAll(req.params.id, function(err,results) {
			if (results !== null) {
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
					if(obj.conditionnement !== null)
						tb.push(obj.conditionnement.toString());
					else
						tb.push(obj.conditionnement);
					tb.push(obj.disponibilite);
					objResult.data.push(tb);

				});
			}
			logger.util(objResult);
			return res.send(objResult);
		});
	},
	getOneById: function (req,res) {
		logger.warn("va rechercher ", req.params.id);
		sails.models.produits.findOne({'id': req.params.id}).exec(function(err,results) {
			if(err !== null && err !== undefined) return res.send({"data": null, "err":err});
			logger.error(err);
			return res.send({
							  'data': results,
							  'err': null
							});
		});
	},
	add: function (req, res) {
		logger.info("DANS ADD");
		var datas = req.body.datas;
		logger.util("data : ", datas);
		sails.models.produits.findOrCreate(datas,datas).exec(function creaStat(err,created){
			logger.warn(err);
			var retour = {err: err};

			return res.send(retour);
		});
	},
	update: function (req, res) {
		var datasInitial = {id: req.body.datas.id};
		logger.util(req.body);
		sails.models.produits.update(datasInitial,req.body.datas).exec(function creaStat(err,updated){
			logger.warn(err);
			var retour = {err: err};

			return res.send(retour);
		});
	},
	remove: function (req, res) {
		sails.models.produits.destroy (req.query.datas).exec(function creaStat(err,updated){
			logger.warn(err);
			var retour = {err: err};

			return res.send(retour);
		});
	},
	getTypes: function (req, res) {
		logger.util("ok dans getTypes ");
		var sql = " select * from caisse.typesproduits order by nom asc";
		sails.models.typesproduits.query(sql,function(err,results) {
			logger.warn(err);
			if (err) return res.send({'err': err});
			//logger.util(results);
			return res.send({'err': null, 'data': results});
		});
	},
	upload: function(req,res) {
		req.file('icone').upload(function (err, uploadedFiles) {
		  console.log("dans upload", uploadedFiles);

		  if (err) return res.send(500, err);
		  var repImages = sails.config.productImages;
		  logger.warn("rep images : ", repImages);
		  mkdirp(repImages, function(err) { 
		  	var fn = process.cwd() + sails.config.productImages + uploadedFiles[0].filename;
		  	logger.warn("dest images : ", fn);
		  	
		  	var stream = fs.createReadStream(uploadedFiles[0].fd);
	        stream.pipe(fs.createWriteStream(fn));
	        stream.on('end', function(){
				logger.util(uploadedFiles);
		        return res.json({
				    message: sails.config.productImages + uploadedFiles[0].filename,
				    filepath: sails.config.relativProductImages + uploadedFiles[0].filename
				}); 
	        });
	        
		  });
		});
	}
};
