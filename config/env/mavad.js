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
  chemin_impression_catalogue: "/var/impression/last_catalogue.html",
  chemin_impression_commande: "/var/impression/commande/",
  productImages: "/var/node/lawattine/assets/images/uploads/leclerc/",
  relativProductImages: "/images/uploads/leclerc/",
  importProductsFolder: "/var/leclerc/",
  images_rayons_download: "/var/node/lawattine/assets/images/images_rayons_down/",
  template_catalogue: "/var/node/lawattine/assets/var/node/lawattine//images/template_catalogue.txt",
  template_commande: "/var/node/lawattine/assets/images/template_commande.html",
  archives: "/var/log/leclerc/",
  impressions: "/var/impression/",
  ip_dev: "176.151.197.161",
  ip_mavad01: "",
  ip_master: ""


};
