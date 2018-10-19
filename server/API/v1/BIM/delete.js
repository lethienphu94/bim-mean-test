
module.exports = (req, res) => {
    let dataForm = req.query || req.body;

    if (typeof dataForm.id !== 'string' || dataForm.id.trim() === '')
        return res.status(403).send({ message: 'The id attribute is a string type and cannot be empty !!!' });

    req.MODEL_BIM
        .findOne({ _id: dataForm.id })
        .exec(function (err, dataBIM) {
            if (err)
                return res.status(403).send(err);
            if (dataBIM === null)
                return res.status(403).send({ message: 'BIM not exist !!!' });
            
            dataBIM.remove(function (err, data) {
                if (err) return res.status(403).send(err);
                return res.status(200).json({ message: 'Your BIM has been deleted.' });
            });
        });
}