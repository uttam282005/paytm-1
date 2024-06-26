const express = require('express');
const router = express.Router(); 
const user_router = require('./user')
const account_router  = require('./account');

router.use('/user', user_router);
router.use('/account', account_router);

module.exports = router;
