var express = require('express');
var router = express.Router();
var service = require("./service");
const url = require('url');


/* GET users listing. */
router.get('/', function(req, res, next) {
  const reqUrl = url.parse(req.url, true);
  const callBack = function(serviceError,serviceResponse){
    if(serviceError){
      res.status(400).send(serviceError);
    }else{
      res.json(serviceResponse);
    }
  }
  service.getMyShortUrls(reqUrl.query["user-id"], callBack);
  
});

router.post('/', function(req, res, next) {
  const callBack = function(serviceError,serviceResponse){
    if(serviceError){
      res.status(400).send(serviceError);
    }else{
      res.json(serviceResponse);
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
  var baseUrl = url.format(baseUrlObj)+"/r"; 
  
  service.makeShortUrl(baseUrl,req.body, callBack);
  
});

module.exports = router;
