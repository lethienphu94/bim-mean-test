const router = require('express').Router();

router.use('/', (req, res, next) => {
    req.MODEL_BIM = req.app.db.models.BIM;
    next();
});

router
   .route('/')
   .post(require('./create'));

router
   .route('/')
   .get(require('./read'));

router
   .route('/')
   .put(require('./update'));

router
   .route('/')
   .delete(require('./delete'));

router
   .route('/export-pdf')
   .get(require('./exportPDF'));

module.exports = router;