'use strict';

let App = require(__dirname+'/../../components/App');
let Utils = App.Utils();
let User = App.getModel('User');



// Get a single user
exports.get = function(req, res) {
  res.send('hello world');
  // User.getById(req, req.params.userId).then(
  //   (user) => Utils.response(req,res,200, user),
  //   (err) => Utils.error(req, res, err)
  // )
};

// // Create a single user
// exports.signUp = function(req, res) {
//   User.create(req,req.body).then(
//     () => Utils.response(req,res,201),
//     (err) => Utils.error(req,res,err)
//   )
// };
//
// exports.signIn = function (req, res) {
//   User.login(req, req.body).then(
//     (user) => Utils.response(req, res, 200, user),
//     (err) => Utils.error(req, res, err, 404)
//   )
// };

