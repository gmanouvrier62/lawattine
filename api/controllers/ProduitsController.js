var fs = require('fs');
var util = require("util");
var moment = require('moment');
var logger = require('../services/logger.init.js').logger("tom.txt");
var sleep = require("sleep");
var mkdirp = require('mkdirp');

var path = require('path');
var formidable = require('formidable');

module.exports = {

	home: function (req, res) {
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
	getAll: function (req, res) {
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
				tb.push(obj.disponibilite);
				objResult.data.push(tb);

			});
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