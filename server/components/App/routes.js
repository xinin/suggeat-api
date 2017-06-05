/**
 * Main application routes
 */

'use strict';

let App = require(__dirname+'/index');
let config = App.Config();

module.exports = function(app) {
  // Insert routes below
  app.use('/user', require(config.root+'api/user'));
  // app.use('/wishlist', require(config.root+'api/wishlist'));
  // app.use('/wish', require(config.root+'api/wish'));

  app.use('/status', function(req, res){
    res.status(202).send('OK');
  });

  app.route('/*').get(function(req, res) {
      res.status(404).end();
  });
};
