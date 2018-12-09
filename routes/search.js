var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('search', { title: 'CS355 Search' });
});

module.exports = router;
