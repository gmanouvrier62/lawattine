var fs = require('fs');
var util = require("util");
var moment = require('moment');
var sleep = require('sleep');
var Immutable = require('immutable');
var mkdirp = require('mkdirp');
var Curl = require( 'node-libcurl' ).Curl;
var logger = require('../services/logger.init.js').logger("tom.txt");
var rep_base = "/var/leclerc/";

module.exports = function(idRayon, callback){

	var lCurl = function(ccurl, l_url, callback) {
		ccurl.setOpt( 'URL', l_url );
	    ccurl.setOpt( 'FOLLOWLOCATION', true );
	    ccurl.on( 'end', function( statusCode, body, headers ) {
	        logger.info('pour' + l_url);     
	        logger.info( statusCode );
	        logger.info( '---' );
	        logger.info( body.length );
	        logger.info( '---' );
	        logger.info( this.getInfo( 'TOTAL_TIME' ) );
	        var tb = body.split("('ctl00_main_ctl05_pnlElementProduit',");
	        if(tb.length > 0) {
	            var part2 = tb[1];
	            if(part2 !== null && part2 !== undefined) {
		            var tb2 = part2.split('Utilitaires.widget.initOptions');
		            var leJSON = tb2[0];
		            leJSON = leJSON.substring(0,leJSON.length-2);
		            var tbFn = l_url.split('rayon-');
		            var fn = tbFn[1] + '.json';
		     
		            fs.writeFile(sails.config.importProductsFolder + fn, leJSON, function (err) {
		                callback(null);
		                if (err) {
		                  logger.info("pas bon pour " + l_url);
		                } else {
		                    logger.info("ok ducky");
		                }
		            });
		        }
	        }
	        this.close();
	       
	        
	    });
	    ccurl.on( 'error', function(err) {
	    	ccurl.close.bind( ccurl  );
	    	callback('err' + err);
		});
	    ccurl.perform();

	};

	
 
	
	var tbLiens = ['http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284322-Viandes-Poissons.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284325-Boucherie.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284326-Volailles-et-Gibiers.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284327-Poissonnerie.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-285187-Traiteur-de-la-mer.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284323-Fruits-Legumes.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284321-Pains-Patisseries.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284320-Frais.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284246-Surgeles.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284319-Epicerie-salee.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284309-Epicerie-sucree.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284310-Boissons.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284311-Bebe.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284314-Bio.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284315-Hygiene-Beaute.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284316-Entretien-Nettoyage.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284317-Animalerie.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284318-Bazar-Textile.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284323-Fruits-Legumes.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284351-Legumes.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284351-Legumes.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284350-Jus-de-fruits-et-legumes-frais.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284349-Fruits.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284358-Pains-et-Patisseries.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284361-Pains-de-mie-et-Pains-grilles.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284362-Patisseries-moelleuses.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284370-Laits-et-Oeufs.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284371-Beurres-et-Cremes.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284372-Fromages.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284373-Charcuteries.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284374-Traiteur.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284375-Yaourts-et-Fromages-frais.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284376-Desserts.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-286690-Prepare-sur-place-.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284247-Aperitifs-Entrees-et-Snacks.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284248-Plats-cuisines-Pizzas-Tartes.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284249-Viandes-et-Poissons.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284250-Legumes-et-Frites.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284251-Glaces-et-Desserts-glaces.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284421-Pates-Riz-Feculents-Sauces.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284422-Conserves-et-Bocaux.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284423-Plats-cuisines.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284424-Aperitifs.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284425-Assaisonnements-et-Condiments.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-288378-Aides-a-la-cuisine-Bouillons.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284426-Soupes-et-Croutons.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-288991-Saveurs-du-monde.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284748-Boissons-du-matin-ou-du-soir.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284748-Boissons-du-matin-ou-du-soir.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284467-Petits-dejeuners.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284482-Biscuits.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284483-Patisseries-moelleuses.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284484-Chocolats-et-confiseries.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284485-Desserts-Sucres-et-Farines.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-288906-Dietetique-et-Allege.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-285414-Sirops-et-Boissons-aux-fruits.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284534-Eaux-et-Laits.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284520-Jus-de-fruits-et-legumes.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284529-Colas-et-Boissons-gazeuses.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284519-Bieres-Alcools-et-Aperitifs.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-285383-Vins-rouges.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-285395-Vins-blancs-et-roses.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284518-Champagnes-Mousseux-Cidres.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284552-Laits-et-Petits-dejeuners.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284553-Repas-de-bebe.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284554-Gouters-et-desserts.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284555-Couches-lingettes-et-cotons.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284556-Soins-et-puericulture.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284557-Le-marche-Bio.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284558-Frais-et-Surgeles-Bio.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284559-Epicerie-salee-Bio.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284560-Epicerie-sucree-Bio.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284561-Boissons-Bio.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284562-Bebe-Bio.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284563-Hygiene-et-beaute-Bio.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284593-Soins-du-corps.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284601-Soins-du-visage.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284602-Soins-des-cheveux.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284611-Hygiene-dentaire.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284615-Soins-des-hommes.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284623-Hygiene-feminine-Incontinence.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284629-Parapharmacie.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284633-Essuie-tout-papiers-et-cotons.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284639-Lessives.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284645-Entretien-du-linge.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284646-Nettoyants-vaisselle.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284647-Nettoyants-maisons.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284649-Accessoires-menagers.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284648-Desodorisants-et-Insecticides.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284671-Les-chiens.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284675-Les-chats.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284676-Autres-animaux.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284684-Maison-Linge-et-Textile.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284687-Cuisine-et-Vaisselle.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284691-Papeterie-DVD-Presse-Jeux.aspx"',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284688-Bricolage-et-Automobile.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284690-Piles-Ampoules-et-Electricite.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284692-Chauffage-et-allumage.aspx',
	'http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284689-Fleurs-Jardin-et-Piscine.aspx'];
	var cpt = 0;
	
	if(idRayon !== null) {

	} else {
		for (var cptL = 0; cptL < tbLiens.length; cptL++) {
			var curl = new Curl();
		    var full_url = tbLiens[cptL];
		    logger.warn("pour ", full_url);
		    lCurl(curl, full_url, function(result){
		    	cpt++;
		    	//logger.warn("pour ", full_url);
		    	logger.warn('retour :' , result);
		    	logger.warn("passe n ", cpt);
		    	if(cpt == tbLiens.length-1) {
		    		logger.warn("Fini la création des json");
		    		callback("C OK");
		    	}
		    });
		    sleep.sleep(1);
		} 
		
	}

};

