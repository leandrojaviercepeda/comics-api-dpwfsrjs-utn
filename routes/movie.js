let express = require('express');
let router = express.Router();
let movieModel = require('../src/movieModel');

router.get('/', async function (req, res, next) {
  try {
    res.send(await movieModel.get(req.query));
  } catch (error) {
    console.error(error);
    res.status(500).send({message: error.message || error})
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    res.send(await movieModel.getById(req.params.id));
  } catch (error) {
    console.error(error);
    res.status(500).send({message: error.message || error})
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    res.send(await movieModel.del(req.params.id));
  } catch (error) {
    console.error(error);
    res.status(500).send({message: error.message || error})
  }
});

router.post('/', async function (req, res, next) {
  try {
    res.send(await movieModel.insert(req.body));
  } catch (error) {
    console.error(error);
    res.status(500).send({message: error.message || error})
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    res.send(await movieModel.update(req.params.id, req.body));
  } catch (error) {
    console.error(error);
    res.status(500).send({message: error.message || error})
  }
  
});

module.exports = router;