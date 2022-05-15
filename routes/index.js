let express = require('express');
let router = express.Router();
const package_json = require('../package.json');

router.get('/', function(req, res, next) {
  res.send({
    app: package_json.name,
    version: package_json.version
  });
});

module.exports = router;
