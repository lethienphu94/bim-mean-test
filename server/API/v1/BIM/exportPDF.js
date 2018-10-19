const fs = require('fs'),
    pdf = require('pdfkit'),
    PATH_FILEUPDATE_PDF = './FILE-UPLOAD/PDF/';

module.exports = (req, res) => {

    let dataBIM = [];
    let dataListLOD = {};
    let dataJson = [];
    async function execute() {
        await Promise.all([getListLOD(), getListBIM()]);
        await coverJson();
  
        let pathFile = PATH_FILEUPDATE_PDF + Date.now() + '.pdf';
        await exportFilePDF(pathFile);
        
        return res.download(pathFile);
        
        

    }

    execute();

    function exportFilePDF(pathFile) {
        return new Promise(function (resolve, reject) {
            var filePDF = new pdf;
            let writeStream = fs.createWriteStream(pathFile);
            filePDF.pipe(writeStream);
            filePDF.font('Times-Roman')
                .fontSize(12)
                .text(JSON.stringify(dataJson,null, 2));
            filePDF.end();
     
            writeStream.on('finish', function () {
                resolve();
            });
            
        });
    }

    function coverJson() {
        return new Promise(function (resolve, reject) {
            let dataLODTemp = {};
            dataListLOD.forEach(data => {
                dataLODTemp[data.name + '(' + data.value + ')'] = false;
            });
           
            dataBIM.forEach(data => {
                let dataLopTempCopy = JSON.parse(JSON.stringify(dataLODTemp));
                let dataTemp = data['_doc']; 
                if(Array.isArray(dataTemp.lodLevels) === false)
                    dataTemp.lodLevels = [];
                dataTemp.lodLevels.forEach( dataLOD => {
                    dataLopTempCopy[dataLOD.name + '(' + dataLOD.value + ')'] = true;
                });
                dataTemp = {
                    id: data._id,
                    name: data.name,
                    designerCode: data.designerCode,
                    cenkrosCode: data.cenkrosCode,
                    description: data.description,
                    lodLevels: dataLopTempCopy,
                    parameters:data.parameters
                }
                dataJson.push(dataTemp);
            });
            resolve();
        });
    }
    function getListLOD() {
        return new Promise(function (resolve, reject) {
            req.app.db.models.LOD
                .find({})
                .select('id name value')
                .sort('-value')
                .exec(function (err, listLOD) {
                    if (err)
                        return res.status(403).send(err);
                    dataListLOD = listLOD;
                    resolve();
                });
        });

    }
    function getListBIM() {
        return new Promise(function (resolve, reject) {
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

            req.MODEL_BIM
                .find(queryObj)
                .sort(sortBy)
                .populate({
                    path: 'lodLevels',
                    select: 'fileName name value',
                })
                .exec(function (err, listBIM) {
                    if (err)
                        return res.status(403).send(err);
                    if (listBIM.length === 0)
                        return res.status(403).send({ message: "Total = 0, can not export to PDF file" });
                    dataBIM = listBIM;
                    resolve();
                });
        });


    }


}