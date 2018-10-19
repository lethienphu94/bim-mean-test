module.exports = (req, res) => {
    var dataForm = req.body;

    checkBIMExist()
        .then(updateBIM)

    function checkBIMExist() {
        return new Promise(function (resolve, reject) {
            if (typeof dataForm.id !== 'string' || dataForm.id.trim() === '')
                return res.status(403).send({ message: 'The id attribute is a string type and cannot be empty !!!' });
            else
            req.MODEL_BIM
                .findById(dataForm.id)
                .exec(function (err, data) {
                    if (err)
                        return res.status(403).send(err);
                    if (data === null)
                        return res.status(403).send({ message: 'BIM not exist !!!' });
                    dataUpdate = data;
                    resolve();
                });
        });
    }

    function updateBIM() {
        var attributeArray = ['name', 'designerCode', 'cenkrosCode', 'description'];

        attributeArray.forEach(nameAttribute => {
            if (typeof dataForm[nameAttribute] === 'string' && dataForm[nameAttribute].trim() !== '') {
                dataUpdate[nameAttribute] = dataForm[nameAttribute];
            }
        })


        if (typeof dataForm.unit === 'string' && dataForm.unit.trim() !== '')
            dataUpdate['parameters']['unit'] = dataForm.unit;
        if (typeof dataForm.term === 'string' && dataForm.term.trim() !== '')
            dataUpdate['parameters']['sucategory_id']['term'] = dataForm.term;



        if (Array.isArray(dataForm.lodLevels)) {
            dataUpdate.lodLevels = [];
            dataForm.lodLevels.forEach(idLod => {
                if (typeof idLod === 'string' && idLod.trim() !== '')
                    dataUpdate.lodLevels.push(idLod);
            });
        }

        dataUpdate.save(dataUpdate, function (err, data) {
            if (err)
                return res.status(403).send(err);
            return res.status(200).json({ message: 'Update BIM successful !!!' });
        });
    }

    




}