 var request = require('request');
 function definer(){
 	definer.prototype.locator = function(urlHost, urlPath, callback) {
	 	var fullUrl = urlHost + urlPath;
	 	request(fullUrl, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	console.log("ok ", "");
		    if (sails.config.catalogueHost == "") {
		    	sails.config.catalogueHost = urlHost;
		    	console.log("J'ai déterminé que le serveur distant le plus adapté est ", urlHost);
		    	callback(urlHost);
		    }
		  } else {
		  	console.log("mauvaise pioche ", fullUrl, " status=", error);
		  	callback("");
		  }
		});
 	};
 };