var request = require('request');
var fs = require('fs');
var util = require("util");
var moment = require('moment');
//var sleep = require('sleep');
var cheerio = require('cheerio');
var Immutable = require('immutable');
var mkdirp = require('mkdirp');

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

//divWCRS310_Content
//contient une image
//contient 1 p de class pWCRS310_PrixUnitaire
//contient 1 p de class pWCRS310_PrixUniteMesure


var crea =" var tbLiens = [";
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
function navig(full_u, callback) {

	var req=new request(full_u, function (error, response, body) {
		//idx++;
		 if (!error && response.statusCode == '200') {
	        console.log("ok nav : " + full_u);
	        //lister les lien de la slidebarre
	        var dirBase = "/home/gilles/node/leclerc";
	        var fname = full_u.replace('http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem','');
	        var dirname= fname.replace(".aspx","");
	        $ = cheerio.load(body);
	        mkdirp(dirBase + dirname, function(err) { 
	        	if(err) {
	        		console.log("err pour crea : ", dirBase + dirname);
	        	} else {
	        		console.log("va creer ", dirBase + dirname + fname);
					fs.writeFile(dirBase + dirname + fname, body, function (err) {
			           
			            if (err) {
			              console.log("pas bon pour " + full_url);
			               callback(err);
			            } else {
			            	console.log("ok", dirBase + dirname + fname); 

			            	
			            	$('a').each(function(i, elem) {
			            		
			            				console.log("href : ", $(this).attr('href'));
			            		
			            		

			            	});
			            	 //callback(null);
	/*
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
	*/
			            }
			        });
				}
			});
	    }
	});




}

navig('http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/rayon-284351-Legumes.aspx?Filtres=4-284352', function(retour){

		if(retour !== null)
			console.log("err il y a");
		else
			console.log("pas d'erreur");
});
/*
for(var cpt = 0; cpt < tbLiens.length;cpt++) {
	var full_url = tbLiens[cpt];
	navig(full_url, function(retour){

		if(retour !== null)
			console.log("err il y a");
		else
			console.log("pas d'erreur");
	});

}
*/