var fs = require('fs');
var logger = require('../services/logger.init.js').logger("tom.txt");

module.exports = {

home: function(req, res) {
	var action = "edition";
	if(req.params.act !== null && req.params.act !== undefined) {
		action = req.params.act;
	}
	var menu = fs.readFileSync(sails.config.appPath + '/views/menu.ejs').toString();
	return res.render ('edition/edition',{'action': action, 'menu': menu});
}


};
