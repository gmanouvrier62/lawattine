/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/':                      'HomeController.home',
  '/admin':                 'AdminController.home',
  '/maj':                   'ProduitsController.prepare_import_json',
  '/produits':              'ProduitsController.home',
  '/produits/getAll/:id':       'ProduitsController.getAll',
  '/produits/getAllCrit/:nom':       'ProduitsController.getAllCrit',
  '/produits/getOneById/:id':   'ProduitsController.getOneById',
  '/produits/upload':       'ProduitsController.upload',
  '/produits/types/list':     'ProduitsController.getTypes',
  '/produits/import':       'ProduitsController.import', 
  '/produits/prepare_import_json': 'ProduitsController.prepare_import_json',
  '/produits/import_rayon_json/:id': 'ProduitsController.import_rayon_json',
  '/produits/marge':        'ProduitsController.marge',
  '/produits/repartition_com':  'ProduitsController.repartition_com',
  '/produits/apply_com':       'ProduitsController.apply_com',
  '/produits/distinct/:id_client': 'ProduitsController.getDistinctProductsByClient',
  '/clients':               'ClientsController.home',
  '/clients/getAll':        'ClientsController.getAll',
  '/clients/getAllJson':        'ClientsController.getAllJson',
  '/clients/getOneById/:id':   'ClientsController.getOneById',  
  '/edition':                  'EditionController.home',
  '/edition/:act':             'EditionController.home',
  '/edition/action/create':             'EditionController.save',
  '/edition/catalogue/getAll':          'EditionController.getAll',
  '/edition/ajouter/:id':               'EditionController.editer_catalogue',
  '/edition/get/:id':                   'EditionController.getCatalogue',
  '/edition/get_formated_catalogue/:id':    'EditionController.getFormatedCatalogue',
  '/edition/catalogue/print':                         'EditionController.print',
  '/fournisseurs':               'FournisseursController.home',
  '/fournisseurs/getAll':        'FournisseursController.getAll',
  '/fournisseurs/getOneById/:id':   'FournisseursController.getOneById',  
  '/commandes':                     'CommandesController.home',
  '/commandes/client/:id_client':   'CommandesController.home',
  '/commandes/status/:status':          'CommandesController.home',
  '/commandes/addormodify':             'CommandesController.addormodify',
  '/commandes/get_commandes/:id_client': 'CommandesController.getCommandes',
  '/commandes/livrer':             'CommandesController.livrer',
  '/commandes/print/:id':          'CommandesController.print',
  '/commandes/valider':              'CommandesController.valider',
  '/commandes/retirer_produit':      'CommandesController.retirer_produit',
  '/commandes/load/:id/client/:id_client':              'CommandesController.load',
  '/commandes/get/:id/client/:id_client' :              'CommandesController.getCommandeById',
  '/commandes/histo/:id/client/:id_client':     "CommandesController.load_history", 
  '/achats':                        'AchatsController.home',
  '/achats/achat_todo':             'AchatsController.achat_todo',
  '/stocks':                        'StocksController.home',
  '/chiffres/ventes/:periode':             'StatsController.home',
  '/chiffres/ventes/:periode/:debut/:fin':  'StatsController.home',
  '/chiffres/ventes_jour':        'StatsController.ventes_jour' 
  
  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
