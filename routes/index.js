let express = require('express');
let router = express.Router();
const package_json = require('../package.json');
let { init } = require('../src/DB');

router.get('/', function(req, res, next) {
  init();
  res.send({
    app: package_json.name,
    version: package_json.version
  });
});

module.exports = router;
