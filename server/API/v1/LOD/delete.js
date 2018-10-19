PATH_FILEUPDATE_IMG = './FILE-UPLOAD/IMG/',
module.exports = (req, res) => {
    let dataForm = req.query || req.body;


    if (typeof dataForm.id !== 'string' || dataForm.id.trim() === '')
        return res.status(403).send({ message: 'The id attribute is a string type and cannot be empty !!!' });

    req.MODEL_LOD
        .findOne({ _id: dataForm.id })
        .exec(function (err, dataLOD) {
            if (err)
                return res.status(403).send(err);
            if (dataLOD === null)
                return res.status(403).send({ message: 'LOD not exist !!!' });
            if (dataLOD.fileName !== '') {
                let pathFileIMG = PATH_FILEUPDATE_IMG + dataLOD.fileName;
                if (fs.existsSync(pathFileIMG)) {
                    fs.unlinkSync(pathFileIMG);
                }
            }
            
            dataLOD.remove(function (err, data) {
                if (err) return res.status(403).send(err);
                return res.status(200).json({ message: 'Your LOD has been deleted.' });
            });
        });
}