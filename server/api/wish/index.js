'use strict';

var express = require('express');
var controller = require('./wish.controller');

var router = express.Router();

router.get('/:wishId', controller.getById);

router.post('/create', controller.create);


module.exports = router;
