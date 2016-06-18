'use strict';

let App = require(__dirname+'/../../components/App');
let Utils = App.Utils();
let Wishlist = App.getModel('Wishlist');

exports.getById = function(req, res) {
  console.log("LLEGAMOS AL GET BY ID DEL API "+ req.params.wishlistId)
  Wishlist.getById(req, parseInt(req.params.wishlistId)).then(
    (wishlist) => Utils.response(req, res, 200, wishlist),
    (err) => Utils.error(req, res, err)
  )
};
