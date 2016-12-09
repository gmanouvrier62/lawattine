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
		
		return res.render ('commandes/commandes_liste',{'action': 'commandes', 'menu': menu});
	},
	load: function (req, res) {
		logger.warn(sails.config.appPath);
		var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
		//chargement d'une commande en vue d'un affichage
		var idCmd = 0;
		if (req.params.id !== null && req.params.id !== undefined) {
			idCmd = req.params.id;
		}
		var id_client = 0;
		if (req.params.id_client !== null && req.params.id_client !== undefined) {
			id_client = req.params.id_client;
		}
		sails.models.commandes.getOneFullCommande(idCmd, id_client, function(err, fCom) {
			if (err !== null && err !== undefined) {
				logger.error(err);
				return res.send({'err': "Erreur de récupération de la commande", 'commande': null});
			}
			logger.util(fCom);
			//Je renvoie directement l'objet commande complet
			return res.render ('home/caisse.ejs',{'id': idCmd, 'f_com': JSON.stringify(fCom), 'menu': menu});
		});
		
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
	getCommandes: function(req, res) {
		var status = null;
		var dtDebut = null;
		var dtFin = null;
		var id_client = null;
		var tbCritere = [];
		if (req.body.status !== null && req.body.status !== undefined)
			tbCritere.push("st.id in (" + req.body.status.join(',') + ")");
		if (req.body.id_client !== null && req.body.id_client !== undefined)
			tbCritere.push("id_client = " + req.body.id_client);
		if (req.body.dtDebut !== null && req.body.dtDebut != undefined) {
			if(req.body.dtFin !== null && req.body.dtFin !== undefined)
				tbCritere.push("dt_livraison between '" + req.body.dtDebut + " 00:00:00' and '" + req.body.dtFin + " 23:59:59'");
			else
				tbCritere.push("dt_livraison between '" + req.body.dtDebut + " 00:00:00' and '" + req.body.dtDebut + " 23:59:59'");
		}
		
		var sql = "select c.id as idc, ";
			sql += "c.status as id_status, ";
			sql += "st.nom_status as nom_status, ";
			sql += "clt.id as id_client, ";
			sql += "clt.nom as nom, ";
			sql += "clt.prenom as prenom, ";
			sql += "clt.tel as tel, ";
			sql += "clt.mobile as mobile, ";
			sql += "clt.adresse as adresse, ";
			sql += "clt.cp as cp, ";
			sql += "clt.ville as ville, ";
			sql += "c.dt_livraison dt_livraison from commandes c ";
			sql += "inner join clients clt on c.id_client = clt.id ";
			sql += "inner join status_commande st on st.id = c.status where ";
			sql += tbCritere.join(' and ');

		logger.warn(sql);
		sails.models.commandes.query(sql, function(err, datas){
			if (err !== null && err !== undefined) return res.send({'err':"Erreur de récupération de commandes " + err, 'commandes': null});
			var retour = [];
			for (var c = 0; c < datas.length; c++) {
				var ligne = [];
				ligne.push(datas[c].idc);
				ligne.push(datas[c].id_status);
				ligne.push(datas[c].nom_status);
				ligne.push(datas[c].nom);
				ligne.push(datas[c].prenom);
				ligne.push(datas[c].tel);
				ligne.push(datas[c].mobile);
				ligne.push(datas[c].adresse);
				ligne.push(datas[c].cp);
				ligne.push(datas[c].ville);
				ligne.push(moment(datas[c].dt_livraison).format("YYYY-MM-DD"));
				ligne.push(datas[c].id_client);
				retour.push(ligne);
			}
			var objResult = {"data": []};
			objResult.data = retour;
			//return res.send({'err': null,'commandes': retour});
			return res.send(objResult);
		});
	},
	addormodify: function (req, res) {
		logger.info("DANS ADD commandes");
		var idCmd = req.body.id_commande;
		var lignes = req.body.lignes;
		var id_client = req.body.id_client;
		var dt_livraison = req.body.dt_livraison;
		var cStatus = req.body.status;

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
				if(req.body.status !== null && req.body.status !== undefined) {
					//si ancien status = 2 et nouveau = 3 => prevoir un destockage par requete si com + st=2 et nouv=livré
					//restocker si on passer d'un livré à un valider ou autre
					newC.status = req.body.status;

				}

					sails.models.commandes.update(oldC, newC).exec(function creaStat(err,updated){
						if(err !== null && err !== undefined) return res.send({'err':"Erreur de modification d'une commande : " + err, 'commande': null});
						if(lignes !== null && lignes !== undefined) {
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
	livrer: function(req, res) {
		if(req.body.id_commande == null || req.body.id_commande == undefined || parseInt(req.body.id_commande)<=0) return res.send({"err": "Pas de numéro de commande", "msg": 'KO'});
		if(req.body.id_client == null || req.body.id_client == undefined || parseInt(req.body.id_client)<=0) return res.send({"err": "Pas de numéro de client", "msg": 'KO'});
		
		var idCmd = req.body.id_commande;

		sails.models.commandes.find({'id': parseInt(idCmd)}).exec(function (err, recup) {
			var oldStatus = recup[0].status;
			logger.util('updated : ', recup);
			//quand status de livraison avec old=crea => on destcoke
			if ((oldStatus == 1 || oldStatus == 2 || oldStatus == 3) ) {
				var origine = {
					'id': req.body.id_commande,
					'id_client': req.body.id_client
				};
				var target = {
					'id': req.body.id_commande,
					'id_client': req.body.id_client,
					'status': 4
				};	
				sails.models.commandes.update(origine, target).exec(function (err, updated) {
					if (err !== null && err !== undefined){
					 	logger.error(err);
					 	return res.send({'err': "Erreur de mise à jur de commande : " + err, 'commande': null});
					} else {
						//c bon je peux destocker chaque produti de la commande
						sails.models.commandes.getOneFullCommande(req.body.id_commande, req.body.id_client, function(err, fCom) {
							if (err !== null && err !== undefined) {
								logger.error(err);
								return res.send({'err': "Erreur de récupération de la commande p our destockage!!!", 'commande': null});
							}
							var ccc = 0;
							for(var cpt = 0; cpt < fCom.produits.length; cpt++) {
								var ins = {
									'id_produit': fCom.produits[cpt].id,
									'qte': fCom.produits[cpt].qte * -1,
									'raison': 'livraison',
									'createdAt': moment().format("YYYY-MM-DD HH:mm:ss")
								};
								//
								var allErr = "";
								sails.models.achats.addStock(ins, function (err, result) {
									if (err !== null) {
										logger.error(err);
										allErr += err;	
									}
									logger.warn('le ccc ', ccc, 'le max ', fCom.produits.length) ;
									if (ccc == fCom.produits.length-1) {
										if(allErr != "")
											res.send({"err": allErr, "msg": 'KO'});
										else 
											res.send({"err": null, "msg": 'OK'});
									}
									ccc++;
									
								});
								//
							}
						});
					}
				});
			} else {
				return res.send({'err': 'Requête étrange...','commande': ''});
			}
		});
	},
	update: function (req, res) {
		/*
		var datasInitial = {'id': req.body.datas.id};
		logger.util(req.body);
		sails.models.commandes.update(datasInitial,req.body.datas).exec(function creaStat(err,updated){
			logger.warn(err);
			var retour = {err: err};

			return res.send(retour);
		});
*/
	}
	
};

