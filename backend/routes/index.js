const express = require('express');
const router = express.Router(); 
const user_router = require('./user')
const bank_router = require('./bank');

router.use('/user', user_router);
router.use('/bank', bank_router);

module.exports = router;
