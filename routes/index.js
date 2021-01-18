var express = require('express');
var router = express.Router();
var service = require("./service");
const url = require('url');


/* GET home page. */
router.get('/:s_url', function(req, res, next) {
  var s_url = req.params.s_url;
  const callBack = function(serviceError,serviceResponse){
    if(serviceError || !serviceResponse){
      res.status(400).send(serviceError);
    }else{
      res.redirect(serviceResponse);
    }
  }
  var baseUrlObj = {
    protocol: req.protocol,
    host: req.get('host')
  };
  var port = req.get('port');
  
  if(port !== 80){
    baseUrlObj.port = port;
  }
  var baseUrl = url.format(baseUrlObj)+"/r/"+s_url;
  service.getMyShortUrl(baseUrl, callBack);
});

module.exports = router;
