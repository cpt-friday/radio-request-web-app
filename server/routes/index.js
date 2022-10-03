var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const remoteIP = req.socket.remoteAddress;
  console.log(`Server is live!\nAccess at localhost:9000\nRemotely at ${remoteIP}:9000`);
});

module.exports = router;
