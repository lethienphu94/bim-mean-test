module.exports = (req, res) => {
   

    let limit = req.query.limit << 0;
    if (limit === 0) limit = 5;
    let page = req.query.page << 0;
    if (page === 0) page = 1;


    let sortBy = 'updateAt';

    if (typeof req.query.sortBy === 'string' && req.query.sortBy.trim() !== '')
          sortBy = req.query.sortBy;
    if (typeof req.query.dir === 'string' && req.query.dir.trim() !== '') {
          sortBy = (req.query.dir === 'asc') ? sortBy : '-' + sortBy;
    } else {
          sortBy = '-updateAt';
    }


    let queryObj = {};
    if (typeof req.query.condition === 'string') {
          try {
                queryObj = JSON.parse(req.query.condition);
          } catch (error) {
                queryObj = {};
          }
    }

    req.MODEL_LOD
        .find(queryObj)
        // .skip((page - 1) * limit)
        // .limit(limit)
        .sort(sortBy)
        .lean()
        .exec(function (err, dataLOD) {
            if (err)
                return res.status(403).send(err);

            return res.status(200).json({ data: dataLOD });
        });
}