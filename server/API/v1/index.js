const router = require('express').Router();
const  LINK_FILE = './FILE/';
const fs = require('fs');
router.use('/lod', require('./LOD'));
module.exports = router;