'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/:userId', controller.get);

router.post('/signUp', controller.signUp);
router.post('/signIn', controller.signIn);
router.post('/addWish', controller.addWish);


module.exports = router;
