const router = require('express').Router();
const  LINK_FILE = './FILE/';
const fs = require('fs');
router.use('/lod', require('./LOD'));
router.use('/bim', require('./BIM'));

router
   .route('/exportPDF')
   .get(require('./exportPDF'));

module.exports = router;