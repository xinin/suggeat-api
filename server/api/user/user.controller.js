'use strict';

let App = require(__dirname+'/../../components/App');
let Utils = App.Utils();
let User = App.getModel('User');



// Get a single user
exports.get = function(req, res) {
  console.log("LLEGa aqui",req.params.userId)
  User.getById(req, req.params.userId).then(
    (user) => Utils.response(req,res,200, user),
    (err) => Utils.error(req, res, err)
  )
};

// Create a single user
exports.signUp = function(req, res) {
  User.create(req,req.body).then(
    () => Utils.response(req,res,201),
    (err) => Utils.error(req,res,err)
  )
};

exports.signIn = function (req, res) {
  User.login(req, req.body).then(
    (user) => Utils.response(req, res, 200, user),
    (err) => Utils.error(req, res, err, 404)
  )
};

exports.addWish = function (req, res) {
  User.addWish(req, req.body).then(
    () => Utils.response(req, res, 201),
    (err) => Utils.error(req, res, err)
  )
};

