'use strict';

let App = require(__dirname+'/../../components/App');
let Utils = App.Utils();
let User = App.getModel('User');



exports.get = function(req, res) {
  res.send('hello world GET'+JSON.stringify(req.headers));
};


exports.post = function(req, res) {
  res.send('hello world POST'+JSON.stringify(req.headers)+JSON.stringify(req.body));
};

exports.put = function(req, res) {
  res.send('hello world PUT'+JSON.stringify(req.headers)+JSON.stringify(req.body));
};

exports.delete = function(req, res) {
  res.send('hello world DELETE'+JSON.stringify(req.headers)+JSON.stringify(req.body));
};

