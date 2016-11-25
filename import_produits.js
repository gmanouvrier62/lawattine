var request = require('request');
var fs = require('fs-extra');
var util = require("util");
var moment = require('moment');
//var sleep = require('sleep');
var cheerio = require('cheerio');
var Immutable = require('immutable');
var mkdirp = require('mkdirp');
var http = require("http");
var rep_base = "/var/leclerc/";
/*
module.exports = function(dt,callback){

	tom = 0;
	String.prototype.clean = function(a) {
		return a.replace("'","''");
	}
	function calculHT(ttc_achat,tva) {
	        var resultat = parseFloat(ttc_achat) /(1 + (parseFloat(tva)/100) );
	        return Math.round(resultat *100)/100;
	}
	function calculPV(ht,txCom,tva) {
	        ht = parseFloat(ht);
	        txCom = parseFloat(txCom);
	        tva = parseFloat(tva);
	        var tt1 = ht +( (txCom*ht)/100 );
	        var resultat = tt1 + ((tt1*tva)/100);
	       
	        return Math.round(resultat *100)/100;
	}

 	fs.readdir(rep_base, function (err, files) {
        if (err) {
            throw err;
        }

        files.forEach(function (file) {
        	console.log(file);
        	contenu = JSON.parse(fs.readFileSync(rep_base + file, "UTF-8"));
        	
        	//console.log(util.inspect(contenu.objContenu.lstElements));
        	var produits = contenu.objContenu.lstElements;
        	for(var cpt = 0 ; cpt < produits.length;cpt++) {
        		tom ++;
        		console.log(produits[cpt].objElement.sLibelleLigne1);
        		var prd = {};
        		prd.nom = produits[cpt].objElement.sLibelleLigne1 + ", " + produits[cpt].objElement.sLibelleLigne2;
        		prd.id_type = produits[cpt].objElement.iIdRayon;
        		prd.ref_interne = "";
        		prd.tva = 5.5;
        		prd.ref_externe = produits[cpt].objElement.iIdProduit;
        		prd.pht =  calculHT(produits[cpt].objElement.nrPVBRIIDeduit,prd.tva);
        		
        		prd.ttc_externe = produits[cpt].objElement.nrPVBRIIDeduit ;
        		prd.tx_com = 30;
        		prd.ttc_vente = calculPV(prd.pht, prd.tx_com, prd.tva);
        		var urlVignette = produits[cpt].objElement.sUrlVignetteProduit;
        		var tbP = urlVignette.split('/');
        		prd.icone = tbP[tbP.length-1];
        		prd.conditionnement = produits[cpt].objElement.sPrixParUniteDeMesure;
        		prd.disponibilite = 1;
        		sails.models.produits.query('SELECT * from caisse.produits where ref_externe=' + prd.ref_externe + "'", function(err, rows, fields) {
				  if (!err) {

				  	if(rows.length <=0) {
				  		//C'est une création
				  		
        				console.util(prd);
        				callback(null,"ok");
        				
					    //prevoir le telechargement de l'icone

				  	} else {
				  		//C'est un update
				  	}


				  } else
				    console.log('erreur de recherche produit');
				});

        	}
     	});
       

		console.log(" ttl : ",tom);
  	});

};
*/

//var full_url = 'http://sclient.netmessage.com/images/ico64x64_companies.gif';

var full_url = 'http://fd8-photos.leclercdrive.fr/image.ashx?id=565326&use=l&cat=p&typeid=i';

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('finish', callback);
  });
};
var tbPath = full_url.split('/');
        var fileN = tbPath[tbPath.length-1];
        var imgName = fileN.split('&use=')[0].replace('image.ashx?id=','') + '.jpg';
download(full_url, '/home/gilles/node/git/caisse/assets/images/uploads/leclerc/' + imgName, function(){
  console.log('done');
});

console.log("ok");


/*
var req=new request(full_url, function (error, response, body) {
	//idx++;
	 if (!error && response.statusCode == '200') {
        console.log("ok nav : " + full_url);
        //lister les lien de la slidebarre
        var buff = new Buffer(body);
        var fd =  fs.openSync('http://fd8-photos.leclercdrive.fr/image.ashx?id=565326&use=l&cat=p&typeid=i', 'a+');
        fs.write("/home/gilles/node/leclerc/bases.jpeg", buff,0, buff.length,0,function (err) {
            if (err) {
              console.log("pas bon pour " + full_url);
            } else {

            	
                 console.log("ok");

            }
        });

    }
});
*/

