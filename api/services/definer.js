 var request = require('request');
 var fs = require("fs");
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
 function checkFolder(chemin) {
			var tb = chemin.split('/');
			var toCheck = "";
			for(var c = 0; c < tb.length; c++) {
				toCheck += tb[c] + '/';
				fs.mkdir(toCheck,function(e){
				    if(!e || (e && e.code === 'EEXIST')){
				        //do something with contents
				    } else {
					    fs.mkdirSync(toCheck,0777);
					    console.warn("j'ai créé le rep : ", toCheck);
				    }
				});
			}
			return toCheck;
		};
//pre check folder
console.log("check folders...");
var tbFolders = [
  sails.config.chemin_impression_commande,
  sails.config.archive_facture,
  sails.config.productImages,
  sails.config.relativProductImages,
  sails.config.importProductsFolder,
  sails.config.images_rayons_download,
  sails.config.images_tmp,
  sails.config.archives,
  sails.config.impressions
];
for(var c = 0; c < tbFolders.length;c++) {
  console.log(tbFolders[c]);
  checkFolder(tbFolders[c]);
}