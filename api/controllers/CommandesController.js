/**
 * CommndesController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var moment = require('moment');
var logger = require('../services/logger.init.js').logger("tom.txt");
var fixePrice = require("../services/fixePrice.js");
module.exports = {
	home: function (req, res) {
		var tom ="";
		var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
		if(req.params.status !== null && req.params.status !== undefined) {
			logger.warn('status concernés : ', req.params.status);
			return res.render ('commandes/commandes_liste',{'action': 'COMMANDES A LIVRER', 'status': req.params.status, 'id_client':"", 'menu': menu});
		} else {
			logger.warn('pas de status donc tous');
			var id_client = "";
			if(req.params.id_client !== null & req.params.id_client !== undefined) {
				id_client = req.params.id_client;
				logger.warn("on a un clt ", req.params.id_client);
			} else {
				logger.warn('pas de clt');
			}

			return res.render ('commandes/commandes_liste',{'action': 'COMMANDES', 'status': [1,2,3,4,5,6],'id_client': id_client, 'menu': menu});	
		}
		
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
			return res.render ('home/caisse.ejs',{'id': idCmd,'status_com': fCom.status, 'f_com': JSON.stringify(fCom), 'menu': menu});
		});
		
	},
	print: function(req, res) {
		String.prototype.minified = function() {
			var tb = this.split(" ");
			var content = "";
			for (var c = 0; c < tb.length; c++) {
				if(tb[c].length > 4)
					content += tb[c].substring(0,5) + '. ';
				else
					content += tb[c] + ' ';
			}
			return content;
		};
		var idCmd = req.body.id;
		var id_client = req.body.id_client;
		if(idCmd == null || idCmd == undefined) return res.send({'err': 'pas de numéro de commande'});
		if(id_client == null || id_client == undefined) return res.send({'err': 'pas de numéro de client'});
		
		sails.models.commandes.getOneFullCommande(idCmd, id_client, function(err, fCom) {
			if (err !== null && err !== undefined) {
				logger.error(err);
				return res.send({'err': "Erreur de récupération de la commande"});
			}
			logger.util(fCom);
			var template = fs.readFileSync(sails.config.template_commande).toString();
			template = template.replace(/@@PRENOM@@/g, fCom.client.prenom);
			template = template.replace(/@@NOM@@/g, fCom.client.nom);
			template = template.replace(/@@ADRESSE@@/g, fCom.client.adresse);
			template = template.replace(/@@CP@@/g, fCom.client.cp);
			template = template.replace(/@@VILLE@@/g, fCom.client.ville);
			template = template.replace(/@@TEL@@/g, fCom.client.tel);
			template = template.replace(/@@MOBILE@@/g, fCom.client.mobile);
			
			template = template.replace(/@@ID_COMMANDE@@/g, fCom.id);
			template = template.replace(/@@MODE_PAIEMENT@@/g, fCom.paiement);
			template = template.replace(/@@DT_LIVRAISON@@/g, moment(fCom.dt_livraison).format("DD-MM-YYYY"));
			var content = "";
			var s = 'style="border-left:1px solid black;border-right:1px solid black"';
			var s2 = 'style="border-left:1px solid black;border-right:1px solid black;border-top:1px solid black;border-bottom:1px solid black"';
			for (var c = 0; c < fCom.produits.length; c++) {
				var prd = fCom.produits[c];
				content += "<tr><td " + s + ">" + prd.nom.minified() + "</td><td " + s + ">" + prd.pu + "</td><td " + s + ">" + prd.qte + "</td><td " + s +">" + prd.ttc + "</td></tr>";
			}
			content += "<tr><td " + s2 + " colspan='2'></td><td " + s2 + ">" + fCom.ttlArticles + "</td><td " + s2 + ">" + fCom.total_commande + "</td></tr>";

			template = template.replace(/@@CONTENT@@/g, content);
			var sepa = "<br>------------------------------------------------------------------------------------------------------------------------<br>";
			template += sepa + template;
			var content_file = '<html><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"></head><body>' + template + '</html>';
			fs.writeFile(sails.config.chemin_impression_commande + fCom.id + ".html", content_file, function (err) {
		    	if (err) {
		    		logger.error({'err': err});
		    		return res.send({'err': err});
		    	}
				return res.send({'err':null, 'content': template});
    		});
			
		});	
	},
	getCommandeById: function(req, res) {
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
			//logger.util(fCom);
			//Je renvoie directement l'objet commande complet
			return res.send(fCom);
		});
	},
	load_history: function (req, res) {
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
		sails.models.commandes.getOneFullCommandeHistorique(idCmd, id_client, function(err, fCom) {
			if (err !== null && err !== undefined) {
				logger.error(err);
				return res.send({'err': "Erreur de récupération de la commande", 'commande': null});
			}
			logger.util("avant res.send : ", fCom);
			//Je renvoie directement l'objet commande complet
			
			return res.render ('home/caisse.ejs',{'id': idCmd,'status_com': fCom.status, 'f_com': JSON.stringify(fCom), 'menu': menu});
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
		sails.models.commandes.getCommandes(req, function(err, retour) {
			if (err !== null && err !== undefined) {
				return res.send({'err': err,'commandes': null});
			}
			var objResult = {"data": []};
			objResult.data = retour;
			//return res.send({'err': null,'commandes': retour});
			logger.util("avant retour ", objResult);
			return res.send(objResult);
		});
	},
	addormodify: function (req, res) {
		logger.info("DANS ADD commandes");
		var idCmd = req.body.id_commande;
		var lignes = req.body.lignes;
		var id_client = req.body.id_client;
		var dt_livraison = req.body.dt_livraison;
		var paiement = req.body.paiement;
		var cStatus = req.body.status;
		var avoir = req.body.avoir;
		var debit = req.body.debit;

		logger.warn("status = ", cStatus);
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
						if(err !== null && err !== undefined) return res.send({'err':"Erreur d'insertion d'un rpoduit dans une commande " + err, 'commande': null});
					
						//sur retour ok, on recupere la comm créé et on affiche le prix
						sails.models.commandes.getOneFullCommande(idCmd, id_client, function(err, fCom) {
							if (err !== null && err !== undefined) {
								logger.error(err);
								return res.send({'err': "Erreur de récupération de la commande", 'commande': null});
							}
							logger.util(fCom);
							var origine = { 'id': id_client};
							var cible = { 
								'current_avoir': avoir,
								'current_debit': debit
							};
							sails.models.clients.update(origine, cible).exec(function creaStat(err,updated) {
								logger.warn('alors update avoir ', updated);
								if (err !== null && err !== undefined) {
									logger.error(err);
									return res.send({'err': "Erreur de l'update client", 'commande': null});
								}
								fCom.client.current_avoir = avoir;
								fCom.client.current_debit = debit;
								
								return res.send({'err': null,'commande': fCom});
							});
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
					'dt_livraison': dt_livraison,
					'paiement': paiement
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
									var origine = { 'id': id_client};
									var cible = { 
										'current_avoir': avoir,
										'current_debit': debit
									};

									sails.models.clients.update(origine, cible).exec(function creaStat(err,updated) {
										logger.warn('alors update avoir ', updated);
										if (err !== null && err !== undefined) {
											logger.error(err);
											return res.send({'err': "Erreur de l'update client", 'commande': null});
										}
										fCom.client.current_avoir = avoir;
										fCom.client.current_debit = debit;
										
										return res.send({'err': null,'commande': fCom});
									});
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
		if (req.body.id_client == null || req.body.id_client == undefined || parseInt(req.body.id_client) <= 0 ) return res.send({'err': 'Aucun client selectionné','commande': null});
		//if (req.body.id_commande == null || req.body.id_commande == undefined || parseInt(req.body.id_commande) <= 0 ) return res.send({'err': 'Il faut un numéro de commande','commande': null});
		
		var avoir = req.body.avoir;
		var debit = req.body.debit;
		var origine = {
			'id': req.body.id_commande,
			'id_client': req.body.id_client
		};
		var target = {
			'id': req.body.id_commande,
			'id_client': req.body.id_client,
			'status': 2,
			'paiement': req.body.paiement
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
				logger.util(fCom);
				var origine = { 'id': req.body.id_client};
				var cible = { 
					'current_avoir': avoir,
					'current_debit': debit
				};
				
				sails.models.clients.update(origine, cible).exec(function creaStat(err,updated) {
					logger.warn('alors update avoir ', updated);
					if (err !== null && err !== undefined) {
						logger.error(err);
						return res.send({'err': "Erreur de l'update client", 'commande': null});
					}
					if(fCom.client !== null && fCom.client !== undefined) {
						fCom.client.current_avoir = avoir;
						fCom.client.current_debit = debit;
					}
					
					return res.send({'err': null,'commande': fCom});
				});
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
					'status': 4,
					'dt_livraison': moment().format("YYYY-MM-DD HH:mm:ss")
				};
				logger.error(target);	
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
										//FIXER LES PRIX au moment de la livraison, les prix ne peuvent plus bouger aprés
										fixePrice(fCom, function(err, retourFinal) {
											logger.warn("retour de fixeprice!!!!");
											if(allErr + err != "")
												res.send({"err": allErr, "msg": 'KO'});
											else 
												res.send({"err": null, "msg": 'OK'});		
										});
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

