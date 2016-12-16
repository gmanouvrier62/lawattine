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
		
		return res.render ('fournisseurs/fournisseurs_list',{'action': 'fournisseurs', 'menu': menu});
	},
	getAll: function (req, res) {
		sails.models.fournisseurs.getAll(function(err,results) {
			var objResult = {"data": []};
			if(results !== null) {
				results.map(function(obj,idx) {
					var tb = [];
					tb.push(obj.id);
					tb.push(obj.nom.toString());
					tb.push(obj.adresse1.toString());
					tb.push(obj.adresse2.toString());
					tb.push(obj.cp.toString());
					tb.push(obj.ville.toString());
					tb.push(obj.tel.toString());
					tb.push(obj.fax.toString());
					tb.push(obj.mobile.toString());
					tb.push(obj.email.toString());
					objResult.data.push(tb);

				});
			}
			logger.util(objResult);
			return res.send(objResult);
		});
	},
	getOneById: function (req,res) {
		logger.warn("va rechercher ", req.params.id);
		sails.models.fournisseurs.findOne({'id': req.params.id}).exec(function(err,results) {
			if(err !== null && err !== undefined) return res.send({"data": null, "err":err});
			logger.error(err);
			return res.send({
							  'data': results,
							  'err': null
							});
		});
	},
	getFournisseurs: function (req, res) {
		logger.util("ok dans getTypes ");
		var sql = " select * from caisse.fournisseurs order by nom asc";
		sails.models.fournisseurs.query(sql,function(err,results) {
			logger.warn(err);
			if (err) return res.send({'err': err});
			//logger.util(results);
			return res.send({'err': null, 'data': results});
		});
	},
	add: function (req, res) {
		logger.info("DANS ADD");
		var datas = req.body.datas;
		logger.util("data : ", datas);
		sails.models.fournisseurs.findOrCreate(datas,datas).exec(function creaStat(err,created){
			logger.warn(err);
			var retour = {err: err};

			return res.send(retour);
		});
	},
	update: function (req, res) {
		var datasInitial = {id: req.body.datas.id};
		logger.util(req.body);
		sails.models.fournisseurs.update(datasInitial,req.body.datas).exec(function creaStat(err,updated){
			logger.warn(err);
			var retour = {err: err};

			return res.send(retour);
		});
	},
	remove: function (req, res) {
		sails.models.fournisseurs.destroy (req.query.datas).exec(function creaStat(err,updated){
			logger.warn(err);
			var retour = {err: err};

			return res.send(retour);
		});
	}
};

