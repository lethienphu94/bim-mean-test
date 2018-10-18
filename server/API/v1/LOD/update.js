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
    let dataIO = {};

    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        dataUpdate = {
            name: fields.name,
            value: fields.value,
            
        };

        checkFileImg(files.imgLOD)
            .then(uploadIMG(files.imgLOD))
            .then(createLOD);
    });

    function checkLODExist(id) {
        return new Promise(function (resolve, reject) {
            req.MODEL_LOD
                .findById(id)
                .exec(function (err, dataConnect) {
                    if (err)
                        return res.status(403).send(err);
                    if (dataConnect === null)
                        return res.status(403).send({ message: 'Connect not exist !!!' });
                    dataConnectOld = dataConnect;
                    resolve();
                });
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
        req.MODEL_LOD.create(dataUpdate, function (err, dataConnect) {
            if (err)
                return res.status(403).send(err);

            return res.status(200).json({ message: 'Create Connect successful !!!' });
        });
    }


}