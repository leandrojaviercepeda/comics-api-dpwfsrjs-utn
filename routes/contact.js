let express = require('express');
let router = express.Router();
const {sendEmail} = require('../src/contactModel');

router.post('/', function (req, res, next) {
  try {
    const body = req.body;
    sendEmail(body);
    res.send({message: 'Email enviado exitosamente!'});
  } catch (error) {
    console.error(error);
    res.status(500).send({message: error.message || error})
  }
});

module.exports = router;
