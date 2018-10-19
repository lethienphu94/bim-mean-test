const formidable = require('formidable')
    PATH_FILEUPDATE_IMG = './FILE-UPLOAD/IMG/',
    path = require('path'),
    fs = require('fs');

module.exports = (req, res) => { 
    let fileName = req.params.fileName;
    let pathFileIMG =  PATH_FILEUPDATE_IMG + fileName;
    if (!fs.existsSync(pathFileIMG)) {
        return res.status(403).send({ success: false, message: 'File does not exist' });
    }
    return res.sendFile(path.join(appRoot, pathFileIMG));
}