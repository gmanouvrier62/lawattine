var fs = require('fs');
var util = require("util");
var moment = require('moment');
var logger = require('../services/logger.init.js').logger("tom.txt");
module.exports = {
	

home : function (req, res){
	/*
		var socket = req.socket;
		var io = sails.io;
	
		io.sockets.emit('messageName', {thisIs: 'thebeuebuebuessage'});
 	var menu = fs.readFileSync('/home/gilles/node/git/lawattine/views/home/caisse.js');
 	 	logger.warn("coucouroucoucou");
   	var tom = menu.toString();
	*/
	logger.warn(sails.config.appPath);
	var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
	return res.render ('home/caisse',{'id': 0, 'f_com': 'zgeg', 'action': 'caisse', 'menu': menu});
  

    

}



 

};
