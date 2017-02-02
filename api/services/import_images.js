var events = require('events');
var fs = require('fs');
var util = require("util");
var moment = require('moment');
var sleep = require('sleep');
var Immutable = require('immutable');
var mkdirp = require('mkdirp');
var request = require( 'request' );
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

var lCurl = function(idx, l_url, repertoire, id_vignette, self) {
	var mkdirSync = function (path, cb) {
      try {
        logger.warn("va créer ", path);
        fs.mkdirSync(path);
        cb();
      } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
        cb();
      }
    }
    
    mkdirSync(sails.config.images_tmp + repertoire, function () {
        // Do something
        
        var fn = id_vignette + '.jpg';
        var filename = sails.config.images_tmp + repertoire + '/' + fn;
        logger.warn("fullPath : ", filename);
        request(l_url).pipe(fs.createWriteStream(filename)).on('close', function(err) {
             if (err) {
              logger.error("pas bon pour " + l_url);
              self.nbErr ++;
              self.pct_ko = parseInt( (self.nbErr*100)/(self.max) );
              if (self.sockets !== null && self.sockets !== undefined) {
                    self.sockets.emit("error", self.pct_ko, self.pct_ok, l_url);
              } 
              self.emit('pasbon');
            }
            sails.models.images_web.setStatus(idx, 2, function(err,st) {
                if (err !== null && err !== undefined) logger.error("err status : ", err);
                logger.info("ok ducky");
                self.nbOk ++;
                self.pct_ok = parseInt( (self.nbOk*100)/(self.max) );
                
                logger.warn('va emttre un completed ', "");
                if (self.sockets !== null && self.sockets !== undefined) {
                    self.sockets.emit("completed",self.pct_ko, self.pct_ok);    
                }
                self.emit('completed');
            });
            if(self.pointeur == self.max) {
                if (self.sockets !== null && self.sockets !== undefined) {
                    self.sockets.emit("json_completed");
                }
                logger.error("!!!!!!!!!OK FINI!!!!!!!!!avant import db");
                
                //self.emit('all_completed');
                if (self.sockets !== null && self.sockets !== undefined) {
                    self.sockets.emit("all_completed");
                }
            } 
        });
    });
    return 0;
};


function import_images(callback) {
	http.listen(1111, function(){
	  console.log('listening on *:1111');
	});
	events.EventEmitter.call(this); 
	self = this;
	this.nbOk = 0;
	this.nbErr = 0;
	this.pct_ok = 0;
	this.pct_ko = 0;
    this.max = 0;
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
	
   
    logger.warn("avant recup des status 0");
    sails.models.images_web.find({'status': 0}).exec(function(err, results) {
        //boucle sur le résultat
        if (err !== null & err !== undefined) {
            callback(err, null);
        }
        logger.warn("recup finie nb : ", results.length);
        self.max = results.length;
        for(var c = 0; c < results.length; c++) {
            var img = results[c];
            //petit repos tous les 5 downloads
            /*
            if(c>0 && c/5 == parseInt(c/5)) {
                sleep.sleep(2);
            }
            */
            logger.warn("avant set à 1 pour une image");
            sails.models.images_web.setStatus(img.id, 1, function(err,st) {
               
                if(err == null && st) {
                    //Ok on traite
                    //logger.warn("ok ");
                    lCurl(this.img.id, this.img.url, this.img.id_type, this.img.id_vignette, self);
                } else {
                    logger.error(err);
                }
            }.bind({img: img}));
        }
        callback(null, true);
    });
	
};

import_images.prototype.__proto__ = events.EventEmitter.prototype;
module.exports=import_images;
