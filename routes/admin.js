var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('admin', { title: 'CS355 Search' });
});

module.exports = router;
