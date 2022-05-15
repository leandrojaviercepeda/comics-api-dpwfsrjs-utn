let express = require('express');
let router = express.Router();
let characterModel = require('../src/characterModel');


router.get('/', async function (req, res, next) {
  try {
    res.send(await characterModel.get(req.query));
  } catch (error) {
    console.error(error);
    res.status(500).send({message: error.message || error})
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    res.send(await characterModel.getById(req.params.id));
  } catch (error) {
    console.error(error);
    res.status(500).send({message: error.message || error})
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    res.send(await characterModel.del(req.params.id));
  } catch (error) {
    console.error(error);
    res.status(500).send({message: error.message || error})
  }
});

router.post('/', async function (req, res, next) {
  try {
    res.send(await characterModel.insert(req.body));
  } catch (error) {
    console.error(error);
    res.status(500).send({message: error.message || error})
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    res.send(await characterModel.update(req.params.id, req.body));
  } catch (error) {
    console.error(error);
    res.status(500).send({message: error.message || error})
  }
  
});

module.exports = router;
