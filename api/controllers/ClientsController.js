/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var logger = require('../services/logger.init.js').logger("tom.txt");

module.exports = {
	home: function (req, res) {
		var tom ="";
		var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
		
		return res.render ('clients/clients_list',{'action': 'clients', 'menu': menu});
	},
	getAll: function (req, res) {
		sails.models.clients.getAll(function(err,results) {
			var objResult = {"data": []};
			if(results !== null) {
				results.map(function(obj,idx) {
					var tb = [];
					tb.push(obj.id);
					tb.push(obj.nom.toString());
					tb.push(obj.prenom.toString());
					tb.push(obj.adresse.toString());
					tb.push(obj.cp.toString());
					tb.push(obj.ville.toString());
					tb.push(obj.tel.toString());
					tb.push(obj.mobile.toString());
					tb.push(obj.email.toString());
					objResult.data.push(tb);

				});
			}
			logger.util(objResult);
			return res.send(objResult);
		});
	},
	getAllJson: function (req, res) {
		sails.models.clients.getAll(function(err,results) {
			var objResult = {"data": []};
			
			logger.util(objResult);
			return res.send(results);
		});
	},
	getOneById: function (req,res) {
		logger.warn("va rechercher ", req.params.id);
		sails.models.clients.findOne({'id': req.params.id}).exec(function(err,results) {
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
		sails.models.clients.findOrCreate(datas,datas).exec(function creaStat(err,created){
			logger.warn(err);
			var retour = {err: err};

			return res.send(retour);
		});
	},
	update: function (req, res) {
		var datasInitial = {id: req.body.datas.id};
		logger.util(req.body);
		sails.models.clients.update(datasInitial,req.body.datas).exec(function creaStat(err,updated){
			logger.warn(err);
			var retour = {err: err};

			return res.send(retour);
		});
	},
	remove: function (req, res) {
		sails.models.clients.destroy (req.query.datas).exec(function creaStat(err,updated){
			logger.warn(err);
			var retour = {err: err};

			return res.send(retour);
		});
	}
};

