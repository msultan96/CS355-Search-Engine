var express = require('express');
var router = express.Router();
var queryCrawler = require('../helpers/crawler');

router.get('/search/:query', function(req, res, next) {
    const { query } = req.params;
    queryCrawler(query)
      .then(() => {
        res.send('crawler finished');
      })
      .catch(() => {
        res.send('crawler screwed up'); 
      })
});

module.exports = router;
