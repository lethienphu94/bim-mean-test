const router = require('express').Router();

router.use('/', (req, res, next) => {
    req.MODEL_LOD = req.app.db.models.LOD;
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
   .route('/image/:fileName')
   .get(require('./image'));


module.exports = router;