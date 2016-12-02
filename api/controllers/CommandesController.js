/**
 * CommndesController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var moment = require('moment');
var logger = require('../services/logger.init.js').logger("tom.txt");

module.exports = {
	home: function (req, res) {
		var tom ="";
		var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
		
		return res.render ('commandes/commandes_list',{'action': 'commandes', 'menu': menu});
	},
	getAll: function (req, res) {
		sails.models.commandes.getAll(function(err,results) {
			var objResult = {"data": []};
			if(results !== null) {
				results.map(function(obj,idx) {
					var tb = [];
					tb.push(obj.id);
					tb.push(obj.id_client);
					tb.push(obj.nom.toString());
					tb.push(obj.status);
					tb.push(obj.tht);
					tb.push(obj.tva);
					tb.push(obj.ttc);
					tb.push(obj.createdAt);
					tb.push(obj.dt_livraison);
					
					objResult.data.push(tb);

				});
			}
			logger.util(objResult);
			return res.send(objResult);
		});
	},
	getAllJson: function (req, res) {
		sails.models.commandes.getAll(function(err,results) {
			var objResult = {"data": []};
			
			logger.util(objResult);
			return res.send(results);
		});
	},
	getOneById: function (req,res) {
		logger.warn("va rechercher ", req.params.id);
		sails.models.commandes.findOne({'id': req.params.id}).exec(function(err,results) {
			if(err !== null && err !== undefined) return res.send({"data": null, "err":err});
			logger.error(err);
			return res.send({
							  'data': results,
							  'err': null
							});
		});
	},

	addormodify: function (req, res) {
		logger.info("DANS ADD commandes");
		var idCmd = req.body.id_commande;
		var lignes = req.body.lignes;
		var id_client = req.body.id_client;
		var dt_livraison = req.body.dt_livraison;
		
		if(dt_livraison == null || dt_livraison == '') {
			dt_livraison =  moment().add(1,"days").format("YYYY-MM-DD");
		}
		
		if(idCmd == null || idCmd == undefined || idCmd <= 0) {
			logger.warn("cmd? ajout : ", idCmd);
			sails.models.commandes.query("insert into caisse.commandes (id_client,status,dt_livraison) values(" + id_client + ",1,'" + dt_livraison + "')", function(err, commande) {
				if (err !== null && err !== undefined) return res.send({'err':"Erreur d'insertion de la commande", 'commande': null});
				var idCmd = commande.insertId;
				logger.warn("id com : ", idCmd);
				for(var cpt = 0; cpt < lignes.length; cpt++) {
					var ligne = {
						id_commande: idCmd,
						id_produit: lignes[cpt].id_produit,
						qte: lignes[cpt].qte
					};
					logger.util("ligne : ", ligne);
					
					sails.models.cmd_pr.findOrCreate(ligne,ligne).exec(function creaStat(err,created){
						if(err !== null && err !== undefined) return res.send({'err':"Erreur d'insertion d'un rpoduit dans une commande", 'commande': null});
					
						//sur retour ok, on recupere la comm créé et on affiche le prix
						sails.models.commandes.getOneFullCommande(idCmd, id_client, function(err, fCom) {
							if (err !== null && err !== undefined) {
								logger.error(err);
								return res.send({'err': "Erreur de récupération de la commande", 'commande': null});
							}
							logger.util(fCom);
							return res.send({'err': null,'commande': fCom});
						});
					});
				}
			});
		} else {
			//C'est une modif de commande existante
			logger.warn("cmd? modify : ", idCmd);
			if(parseInt(idCmd)>0) {
				var oldC= {
					'id': parseInt(idCmd)
				}
				var newC= {
					'id': parseInt(idCmd),
					'id_client': id_client,
					'dt_livraison': dt_livraison
				}
				sails.models.commandes.update(oldC, newC).exec(function creaStat(err,updated){
					if(err !== null && err !== undefined) return res.send({'err':"Erreur de modification d'une commande : " + err, 'commande': null});
					for(var cpt = 0; cpt < lignes.length; cpt++) {
						var ligne = {
							id_commande: idCmd,
							id_produit: lignes[cpt].id_produit,
							qte: lignes[cpt].qte
						};
						logger.util("ligne : ", ligne);
						
						sails.models.cmd_pr.findOrCreate(ligne,ligne).exec(function creaStat(err,created){
							if(err !== null && err !== undefined) return res.send({'err':"Erreur d'insertion d'un rpoduit dans une commande", 'commande': null});
							//sur retour ok, on recupere la comm créé et on affiche le prix
							sails.models.commandes.getOneFullCommande(idCmd, id_client, function(err, fCom) {
								if (err !== null && err !== undefined) {
									logger.error(err);
									return res.send({'err': "Erreur de récupération de la commande", 'commande': null});
								}
								logger.util(fCom);
								return res.send({'err': null,'commande': fCom});
							});
						});
					}
				});
			} else {
				return res.send({'err':"Erreur de modification d'une commande : " + newC, 'commande': null});
					
			}
		}
	},
	
	retirer_produit: function(req, res) {
		var index_ligne = req.body.index_ligne;
		var id_commande = req.body.id_commande;
		var id_client = req.body.id_client;
		var sql = "delete from cmd_pr where id=" + index_ligne + " and id_commande=" + id_commande;
		sails.models.cmd_pr.query(sql, function(err, retrait){
			if (err !== null && err !== undefined){
			 logger.error(err);
			 return res.send({'err': "Erreur de mise à jour de commande : " + err, 'commande': null});
			}
			sails.models.commandes.getOneFullCommande(id_commande, id_client, function(err, fCom) {
				if (err !== null && err !== undefined) {
					logger.error(err);
					return res.send({'err': "Erreur de récupération de la commande", 'commande': null});
				}
				logger.util(fCom);
				return res.send({'err': null,'commande': fCom});
			});
		});
	},
	valider: function(req, res) {
		var origine = {
			'id': req.body.id_commande,
			'id_client': req.body.id_client
		};
		var target = {
			'id': req.body.id_commande,
			'id_client': req.body.id_client,
			'status': 2
		};
		logger.warn('avant update');
		sails.models.commandes.update(origine, target).exec(function (err, updated) {
			if (err !== null && err !== undefined){
			 logger.error(err);
			 return res.send({'err': "Erreur de mise à jur de commande : " + err, 'commande': null});
			}
			sails.models.commandes.getOneFullCommande(req.body.id_commande, req.body.id_client, function(err, fCom) {
				if (err !== null && err !== undefined) {
					logger.error(err);
					return res.send({'err': "Erreur de récupération de la commande", 'commande': null});
				}
				logger.util(fCom);
				return res.send({'err': null,'commande': fCom});
			});
		});

	},
	update: function (req, res) {
		var datasInitial = {id: req.body.datas.id};
		logger.util(req.body);
		sails.models.commandes.update(datasInitial,req.body.datas).exec(function creaStat(err,updated){
			logger.warn(err);
			var retour = {err: err};

			return res.send(retour);
		});
	}
	
};

