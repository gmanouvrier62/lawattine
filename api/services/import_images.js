var events = require('events');
var fs = require('fs');
var util = require("util");
var moment = require('moment');
var sleep = require('sleep');
var Immutable = require('immutable');
var mkdirp = require('mkdirp');
var Curl = require( 'node-libcurl' ).Curl;
var importProduits = require("./import_produits.js");
//var http = require('http').Server(app);
var app = require('express')();
var http = require('http').Server(app);
var logger = require('../services/logger.init.js').logger("tom.txt");
/*
J'ai un tb de liens(pointeur)
Je lance getNext
Lors de la fin de traitement il retourne un event error 1 2 ou completed
*/

var lCurl = function(ccurl, l_url, self) {
	ccurl.setOpt( 'URL', l_url );
    ccurl.setOpt( 'FOLLOWLOCATION', true );
    ccurl.on( 'end', function( statusCode, body, headers ) {
        logger.info('pour' + l_url);     
        logger.info( statusCode );
        logger.info( '---' );
        logger.info( body.length );
        logger.info( '---' );
        logger.info( this.getInfo( 'TOTAL_TIME' ) );
        
        //
        /*
    	if (self.sockets !== null && self.sockets !== undefined) {
    		self.nbErr ++;
    		self.pct_ko = parseInt( (self.nbErr*100)/(self.tbLiens.length-1) );
			self.sockets.emit("bad", self.pct_ko, self.pct_ok, l_url);
		}
		*/
        
    });
    ccurl.on( 'error', function(err) {
    	logger.error("erreur curl");
    	self.nbErr ++;
    	self.pct_ko = parseInt( (self.nbErr*100)/(self.tbLiens.length-1) );
    	ccurl.close.bind( ccurl  );
    	if (self.sockets !== null && self.sockets !== undefined) {
    		self.sockets.emit("bad", self.pct_ko, self.pct_ok);
    	}
	});
    ccurl.perform();
    return 0;
};


function import_images(dest) {
	http.listen(1112, function(){
	  console.log('listening on *:1112');
	});
	events.EventEmitter.call(this); 
	self = this;
	this.nbOk = 0;
	this.nbErr = 0;
	this.pct_ok = 0;
	this.pct_ko = 0;
	this.sockets = null;
	this.destinationFolder = "";

	this.io = require('socket.io')(http);
	this.io.on('connection', function(socket){
	  console.log("ok connect");
	  
	  socket.emit('welcome', "bou du");
	  //socket.emit('meteo_done', {msg:"bou du2"});
	  self.sockets = socket;
	});
	
	this.currentLink = null;
	this.pointeur = -1;	
	this.tbLiens = [];//y placer les liens
    sails.models.images_web.find({'status': 0}).exec(function(err, results) {
        for(var c = 0; c < results.length; c++) {
            var img = results[c];
            sails.models.images_web.setStatus(img.id, 1, function(err,st) {
                if(err == null && st) {
                    //Ok on traite

                }
            })
        }
    });
	
};

import_images.prototype.getNext = function() {
	this.pointeur += 1;
	this.currentLink = this.tbLiens[this.pointeur];
	var curl = new Curl();
    var full_url = this.tbLiens[this.pointeur];
    if(full_url !== null && full_url !== undefined) {
    	logger.warn("pour ", full_url);
    	lCurl(curl, full_url, this);
	}
};

import_images.prototype.__proto__ = events.EventEmitter.prototype;
module.exports=import_images;
