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
  productImages: "/home/gilles/node/git/caisse/assets/images/uploads/leclerc/",
  relativProductImages: "/images/uploads/leclerc/",
  importProductsFolder: "/var/leclerc/",
  archives: "/var/log/leclerc/",
  ip_dev: "176.151.197.161",
  ip_mavad01: "88.178.175.187",
  ip_master: ""



};
