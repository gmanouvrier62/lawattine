var request = require('request');
var fs = require('fs');
var util = require("util");
var moment = require('moment');
var sleep = require('sleep');
var cheerio = require('cheerio');
var Entities = require('html-entities').XmlEntities; 
var Immutable = require('immutable');
var mkdirp = require('mkdirp');
var logger = require('../services/logger.init.js').logger("tom.txt");
var rep_base = sails.config.importProductsFolder;

module.exports = function(callback){

	tom = 0;
	String.prototype.clean = function(a) {
		return a.replace("'","''");
	};
	function calculHT(ttc_achat,tva) {
	        var resultat = parseFloat(ttc_achat) /(1 + (parseFloat(tva)/100) );
	        return Math.round(resultat *100)/100;
	};
	function calculPV(ht,txCom,tva) {
	        ht = parseFloat(ht);
	        txCom = parseFloat(txCom);
	        tva = parseFloat(tva);
	        var tt1 = ht +( (txCom*ht)/100 );
	        var resultat = tt1 + ((tt1*tva)/100);
	       
	        return Math.round(resultat *100)/100;
	};

	var download = function(uri, filename, callback){
	  if(uri !== null && uri !== undefined) {
		  request.head(uri, function(err, res, body){
		    console.log('content-type:', res.headers['content-type']);
		    console.log('content-length:', res.headers['content-length']);
		    if (err !== null && err !== undefined) {
		    	logger.error("ERR : ", err);
		    	logger.error ("pour copier sur ", filename);
		    }

		    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		    
		  });
	  }
	};

	function importAProduct(currentP, fu, callback) {
		var entities = new Entities();
		//prevoir le telchargement img ici avec dedution du nom image
			var full_url = currentP.sUrlVignetteProduit;
				var tbPath = full_url.split('/');
				var fileN = tbPath[tbPath.length-1];
				var imgName = fileN.split('&use=')[0].replace('image.ashx?id=','') + '.jpg';
	
			var prd = {};
			if(currentP.sLibelleLigne1 != "" && currentP.sLibelleLigne1 != undefined)
				currentP.sLibelleLigne1 = entities.decode(currentP.sLibelleLigne1);
			if(currentP.sLibelleLigne2 != "" && currentP.sLibelleLigne2 != undefined)
				currentP.sLibelleLigne2 = entities.decode(currentP.sLibelleLigne2);
			
			prd.nom = currentP.sLibelleLigne1 + ", " + currentP.sLibelleLigne2;
			prd.id_type = currentP.iIdFamille;
			prd.ref_interne = "";
			prd.tva = 5.5;
			prd.ref_externe = currentP.iIdProduit.toString();
			prd.pht =  calculHT(currentP.nrPVBRIIDeduit,prd.tva);
			
			prd.ttc_externe = currentP.nrPVBRIIDeduit ;
			prd.tx_com = 30;
			prd.ttc_vente = calculPV(prd.pht, prd.tx_com, prd.tva);
			var urlVignette = imgName;
			var tbP = urlVignette.split('/');
			prd.icone = tbP[tbP.length-1];
			prd.conditionnement = currentP.sPrixParUniteDeMesure;
			prd.disponibilite = 1;
			prd.qte_dispo = currentP.iQteDisponible;
			prd.id_fournisseur = 1;
			sails.models.produits.findOne({'ref_externe': prd.ref_externe}).exec(function(err,results) {
			  if (!err) {
			  	logger.util("le result : ", results);
			  	if(results == null || results == undefined) {
			  		//C'est une création
					//logger.util("prd : ", prd);
					
					sails.models.produits.findOrCreate(prd,prd).exec(function creaStat(err,created){
						if (err !== null && err !== undefined) {
						 	logger.warn("il y aurait une err : ", err);
						 	return callback(err);
						} else {
							logger.info("create semble ok");
							return callback({current_url: full_url});
						}
					});
			  	} else {
			  		//C'est un update
			  		delete prd.icone;//Je ne prends pas en compte les images 
			  		var datasInitial = {ref_externe: prd.ref_externe};
			  		sails.models.produits.update(datasInitial,prd).exec(function creaStat(err,updated){
						
						if (err !== null && err !== undefined) {
							logger.warn(err);
							return callback(err);
						} else
							return callback({current_url: full_url});
					});
			  	}
			  } else
			    logger.error('erreur de recherche produit ', prd.ref_externe + ", " + prd.nom);
			    logger.error("err : ", err);
			    return callback("err");
			});
		

	};

	//début du parsing du repertoire contenant les json
 	fs.readdir(rep_base, function (err, files) {
        if (err) {
            throw err;
        }
        var lesurl = "";
        files.forEach(function (file) {
        	logger.info(file);
        	contenu = JSON.parse(fs.readFileSync(rep_base + file, "UTF-8"));
        	
        	//console.log(util.inspect(contenu.objContenu.lstElements));
        	var produits = contenu.objContenu.lstElements;
        	
        	for(var cpt = 0 ; cpt < produits.length;cpt++) {
        		tom ++;
        		//logger.warn(produits[cpt].objElement.sLibelleLigne1);
        		var full_url = produits[cpt].objElement.sUrlVignetteProduit;
				var tbPath = full_url.split('/');
				var fileN = tbPath[tbPath.length-1];
				var imgName = fileN.split('&use=')[0].replace('image.ashx?id=','') + '.jpg';

        		importAProduct(produits[cpt].objElement,full_url, function(err) {
        			if(err.current_url != "" && err.current_url !== null && err.current_url != undefined)
					lesurl += err.current_url + '\r\n';
					else
						lesurl +="vide\r\n";
					
						
        		});

        		
        	}
        	
     	});
       

		logger.info(" ttl : ",tom);
		fs.writeFile("/home/gilles/node/git/caisse/lnkImages.txt", lesurl, function (err) {
							logger.warn("c tout fini");
        });
  	});

};

/*
var full_url = 'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284351-Legumes.aspx';

var req=new request(full_url, function (error, response, body) {
	//idx++;
	 if (!error && response.statusCode == '200') {
        console.log("ok nav : " + full_url);
        //lister les lien de la slidebarre
        fs.writeFile("/home/gilles/node/leclerc/base.html", body, function (err) {
            if (err) {
              console.log("pas bon pour " + full_url);
            } else {

            	var li=$('li').each(function(i,elem){
                 	//console.log("li : " + elem.data('data-sidselection'));
                 	console.log($(this).find('a').attr('href'));
                 	crea += "'" + $(this).find('a').attr('href') + "',\r\n";
                	var lili = $(this).find('ul').find('li');
                	lili.each(function(i,elem){
                		console.log("lili : " + $(this).data('sidselection'));
                 		crea += "'" + $(this).find('a').attr('href') + "',\r\n";


                 	});	
                 });
                 crea += "]";
                 console.log("e : " + crea);

            }
        });

    }
});

*/
