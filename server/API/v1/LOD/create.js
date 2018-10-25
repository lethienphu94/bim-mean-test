const formidable = require('formidable')
    PATH_FILEUPDATE_IMG = './FILE-UPLOAD/IMG/',
    fs = require('fs');

function getRandomToken() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
module.exports = (req, res) => {

    let dataUpdate = {};
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        dataUpdate = {
            name: fields.name,
            value: fields.value,
            parameters: fields.parameters,
            description: fields.description,
            createAt: Date.now(),
            updateAt: Date.now()
        };
        try {
            dataUpdate.parameters = JSON.parse(dataUpdate.parameters);
        } catch (error) {
            dataUpdate.parameters = '';
        }

        checkParameters()
            .then(checkFileImg(files.imgLOD))
            .then(uploadIMG(files.imgLOD))
            .then(createLOD);
    });
    
    function checkParameters() {
        return new Promise(function (resolve, reject) {

            if (Array.isArray(dataUpdate.parameters) === false) {
                dataUpdate.parameters = [];
                resolve();
            } else {
                let parametersTemp = [];
                var attributeCheck = [];
                var nameAttribute;
                let lengthParam =  dataUpdate.parameters.length - 1;
                if(lengthParam === -1)
                    resolve();
  
                dataUpdate.parameters.forEach( (dataAttribute, index) => {
                    nameAttribute = dataAttribute.attribute;
                    if (typeof nameAttribute !== 'string' || nameAttribute.trim() === '') 
                        return res.status(403).send({ message: 'The name attribute cannot be empty !!!' });

                    if ( typeof dataAttribute.value !== 'string') 
                        return res.status(403).send({ message: 'The value parameters is type string !!!' });
                       
                    if (attributeCheck.indexOf(nameAttribute) !== -1)
                        return res.status(403).send({ message: 'Attribute Duplicate: ' + nameAttribute + '!!!' });
                    attributeCheck.push(nameAttribute);

                    parametersTemp.push({
                        attribute: dataAttribute.attribute,
                        value: dataAttribute.value
                    });
                    if(lengthParam  === index) {
                        dataUpdate.parameters = parametersTemp;
                        resolve();
                    }
                });
               
            }
        });
    }

    function checkFileImg(dataIMG) {
        return new Promise(function (resolve, reject) {
            if (dataIMG === undefined)
                resolve();
            else if (typeof dataIMG.type !== 'string' || dataIMG.type.indexOf('image') === -1)
                return res.status(403).send({ message: 'Please Update File Type Image' });
            else if (dataIMG.size > 1572864) // > 1.5mb
                return res.status(403).send({ message: 'Image file must be less than 1.5Mb' });
            resolve();
        });
    }

    function uploadIMG(dataIMG) {
        return new Promise(function (resolve, reject) {
            if (dataIMG === undefined)
                resolve();
            else {
                let oldPath = dataIMG.path;
                let fileName = new Date()
                    .toISOString()
                    .replace(/T/, '-')
                    .replace(/\..+/, '')
                    .replace(/:/gi, '-');
                fileName += '-' + getRandomToken();

                switch (dataIMG.type) {
                    case 'image/png':
                        fileName += '.png';
                        break;
                    case 'image/gif':
                        fileName += '.gif';
                        break;
                    case 'image/jpeg':
                        fileName += '.jpg';
                        break;
                    case 'image/svg+xml':
                        fileName += '.svg';
                        break;
                    default:
                        break;
                }
                dataUpdate.fileName = fileName;

                let fileDownload = fs.createReadStream(oldPath);

                let pathFileIMG = PATH_FILEUPDATE_IMG + fileName;


                let fileIMG = fs.createWriteStream(pathFileIMG);

                fileDownload.pipe(fileIMG);
                fileDownload.on('data', function (chunk) { });
                fileIMG.on('finish', function () {
                    fs.unlinkSync(oldPath);
                    if (fileIMG.bytesWritten === 0) {
                        fs.unlinkSync(pathFileIMG);
                        return res.status(403).send({ message: 'File Empty' });
                    } else {
                        resolve();
                    }

                });
                fileIMG.on('error', function (err) {
                    fs.unlinkSync(oldPath);
                    fs.unlinkSync(pathFileIMG);
                    return res.status(403).send({ message: err });
                });
            }

        });

    }

    function createLOD() {
        if(typeof dataUpdate.description !== 'string')
        dataUpdate.description = '';
        req.MODEL_LOD.create(dataUpdate, function (err, data) {
            if (err)
                return res.status(403).send(err);

            return res.status(200).json({ message: 'Create LOD successful !!!' });
        });
    }


}