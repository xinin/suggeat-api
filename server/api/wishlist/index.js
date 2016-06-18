'use strict';

var express = require('express');
var controller = require('./wishlist.controller');

var router = express.Router();

router.get('/:wishlistId', controller.getById);

module.exports = router;
