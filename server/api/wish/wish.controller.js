'use strict';

let App = require(__dirname+'/../../components/App');
let Utils = App.Utils();
let Wish = App.getModel('Wish');

exports.create = function(req, res) {
  Wish.create(req,req.body).then(
    (data) => Utils.response(req,res,200, data),
    (err) => Utils.error(req,res,err)
  )
};


exports.getById = function(req, res) {
  Wish.getById(req, req.params.wishId).then(
    (wish) => Utils.response(req, res, 200, wish),
    (err) => Utils.error(req, res, err)
  )
};
