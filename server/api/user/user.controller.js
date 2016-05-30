'use strict';

let App = require(__dirname+'/../../components/App');
let Utils = App.Utils();
let User = App.getModel('User');

// Create a single user
exports.create = function(req, res) {
  User.create(req,req.body).then(
    () => Utils.response(req,res,201),
    (err) => Utils.response(req,res,err)
  )
};

// Get a single user
exports.get = function(req, res) {
  console.log("LLEGA");
};
