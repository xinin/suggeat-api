'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/:userId', controller.get);
router.post('/:userId', controller.post);
router.put('/:userId', controller.put);
router.delete('/:userId', controller.delete);

// router.post('/signUp', controller.signUp);
// router.post('/signIn', controller.signIn);


module.exports = router;
