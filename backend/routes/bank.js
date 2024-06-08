const express = require('express');
const router = express.Router(); 

router.get('/name', (req, res) => res.send('hi from bank!'));
module.exports = router;