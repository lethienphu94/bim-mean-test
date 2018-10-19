module.exports = (req, res) => {
    var dataForm = req.body;

    var dataUpdate = {};
    var attributeArray = ['name', 'designerCode', 'cenkrosCode', 'description'];

    attributeArray.forEach(nameAttribute => {
        if (typeof dataForm[nameAttribute] === 'string' && dataForm[nameAttribute].trim() !== '') {
            dataUpdate[nameAttribute] = dataForm[nameAttribute];
        }
    })
    dataUpdate['parameters'] = { unit: '', sucategory_id: { term: '' } };

    if (typeof dataForm.unit === 'string' && dataForm.unit.trim() !== '')
        dataUpdate['parameters']['unit'] = dataForm.unit;
    if (typeof dataForm.term === 'string' && dataForm.term.trim() !== '')
        dataUpdate['parameters']['sucategory_id']['term'] = dataForm.term;

    dataUpdate.lodLevels = [];

    if (Array.isArray(dataForm.lodLevels)) {
        dataForm.lodLevels.forEach(idLod => {
            if (typeof idLod === 'string' && idLod.trim() !== '')
                dataUpdate.lodLevels.push(idLod);
        });
    }

    req.MODEL_BIM.create(dataUpdate, function (err, data) {
        if (err)
            return res.status(403).send(err);
        return res.status(200).json({ message: 'Create BIM successful !!!' });
    });




}