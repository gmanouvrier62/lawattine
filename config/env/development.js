/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */
var fs = require ("fs");
module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
     connection: 'someMysqlServer'
   },
  port : 800,
  log: {
            appenders: [
                {type: 'console'},
                {
                    type: 'dateFile',
                    filename: '/var/log/lawattine.log',
                    "pattern": "-yyyy-MM-dd",
                    "alwaysIncludePattern": true
                }
            ],
            replaceConsole: true,
            path: '/var/log/lawattine.log'
        },
  tbPromos: ['http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/offres-288597-Promotions.aspx','http://fd8-courses.leclercdrive.fr/magasin-096201-Leulinghem/bons-de-reduction.aspx'],
  chemin_impression_catalogue: "/var/impression/last_catalogue.html",
  chemin_impression_commande: "/var/impression/commande/",
  archive_facture: "/var/archives/",
  productImages: "/home/gilles/node/git/caisse/assets/images/uploads/leclerc/",
  relativProductImages: "/images/uploads/leclerc/",
  importProductsFolder: "/var/leclerc/",
  images_rayons_download: "/home/gilles/node/git/caisse/assets/images/images_rayons_down/",
  images_tmp: "/var/images_tmp/",
  template_catalogue: "/home/gilles/node/git/caisse/assets/images/template_catalogue.txt",
  hostsList: ["http://localhost:800","http://192.168.0.13","http://88.178.175.187"],
  catalogueHost: "http://88.178.175.187",
  template_commande: "/home/gilles/node/git/caisse/assets/images/template_commande.html",
  archives: "/var/log/leclerc/",
  impressions: "/var/impression/",
  ip_dev: "176.151.197.161",
  ip_mavad01: "88.178.175.187",
  ip_master: ""

};
//SELECT (<value> DIV 0.05) * 0.05 + IF(<value> MOD 0.05 = 0, 0, 0.05)
/*
chemin_impression_commande
 archive_facture
 productImages
 relativProductImages
 importProductsFolder
 images_rayons_download
 images_tmp
 archives
 impressions
*/