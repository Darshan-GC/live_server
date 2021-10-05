const express = require('express');
const router = express.Router();
const cors = require('cors');

router.use(cors());

const Data = require('./dataSchema');

router.get('/', (req, res) => {
  res.send('Server is up and running');
});

router.get('/search/:time', (req, res) => {
  var regex = new RegExp(req.params.time);
  var name = regex.toString().replace(/[/]/g, '');
  var split = name.split('&');
  Data.find({
    createdAt: {
      $gt: new Date(`${split[0]}:00.00Z`),
      $lt: new Date(`${split[1]}:00.00Z`),
    },
  }).then((payload) => {
    res.status(200).json(payload);
  });
});

module.exports = router;
