'use strict';

let App = require(__dirname+'/../../components/App');
let Utils = App.Utils();
let User = App.getModel('User');



exports.get = function(req, res) {
  res.send({data: 'hello world GET'});
};


exports.post = function(req, res) {
  res.send({data:'hello world POST'});
};

exports.put = function(req, res) {
  res.send({data:'hello world PUT'});
};

exports.delete = function(req, res) {
  res.send({data:'hello world DELETE'});
};

