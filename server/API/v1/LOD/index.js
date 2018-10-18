const router = require('express').Router();

router.use('/', (req, res, next) => {
    req.MODEL_LOD = req.app.db.models.LOD;
    next();
});

router
   .route('/')
   .get(require('./read'));


router
   .route('/image/:fileName')
   .get(require('./image'));

router
   .route('/')
   .post(require('./create'));

module.exports = router;