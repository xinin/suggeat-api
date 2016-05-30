'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/', controller.get);
router.post('/signUp', controller.create);

module.exports = router;
