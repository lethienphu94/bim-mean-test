const fs = require('fs'),
    pdf = require('html-pdf'),
    PATH_FILEUPDATE_PDF = './FILE-UPLOAD/PDF/'
    // URL_IMG = 'localhost:400/'



module.exports = (req, res) => {
    let URL_IMG_LOD = req.protocol + '://' + req.get('host') + '/api/v1/lod/image/' ;
    let htmlTemplate = `
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <style type="text/css">
                body {margin: 0;padding: 0;}.header {background-color: #ddd;position: relative;z-index: 1;}.header td {border: none;font-size: 12px;}.logo {float: right;}.clearfix {content: "";clear: both;display: table;}.dataBasic {float: left;}.dataBasic .value {padding-left: 50px;}.content {padding-top: 20px;}.content table, th, td {border: 1px solid black;font-size: 12px;font-weight: normal;}.content table {border: 2px solid black;border-collapse: collapse;width: 100%;}.content table .valueLOD{text-align: right;}.content table .valueLOD span{margin-right: 50px;border-left: 1px solid black;}table img{ max-width: 100%; height: auto; width: auto; /* ie8 */ }.footer {position: relative;z-index: 1;background-color: #ddd;margin-top: 10px;}.footer p {font-size: 12px;}
            </style>
        </head>
        <body>
    `;

    let dataBIM = [];
    let dataListLOD = {};
    let dataJson = [];
    let dataIMG = [];
    async function execute() {
        await  getListBIM();
        await writeHTML();
        let pathFile = PATH_FILEUPDATE_PDF + Date.now() + '.pdf';
        await exportFilePDF(pathFile);
        return res.download(pathFile);
    }

    execute();

    function exportFilePDF(pathFile) {
        return new Promise(function (resolve, reject) {
            let writeStream = fs.createWriteStream(pathFile);
            pdf.create(htmlTemplate, { format: 'A4' }).toStream(function (err, stream) {
                stream.pipe(writeStream);
            });
            writeStream.on('finish', function () {
                resolve();
            });
        });
    }
    function writeHTML() {
        let lengthBIM = dataBIM.length -1 ;

        return new Promise(function (resolve, reject) {
            dataBIM.forEach((BIM, indexBIM) => {
                //Header 
                htmlTemplate += `
                    <div class="header">
                        <div class="logo">
                            <h1>Logo</h1>
                        </div>
                        <div class="dataBasic">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td class="value">${BIM.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Designer code</td>
                                        <td class="value">${BIM.designerCode}</td>
                                    </tr>
                                    <tr>
                                        <td>Cenkros code</td>
                                        <td class="value">${BIM.cenkrosCode}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                `;
                // Thead
                htmlTemplate += `
                    <div class="content">
                        <table>
                            <thead>
                            <th style="width: 120px">
                                HBR LOD Level
                            </th>
                `;
                //Thead Value LOD
                let lengthLOD = BIM['lodLevels'].length - 1;
                let htmlListIMG = `<tr>
                    <td>Geometry</td>
                `;
                BIM['lodLevels'].forEach((LOD, indexLOD) => {
                    // Value LOD
                    htmlTemplate +=`
                        <th class="valueLOD">
                            <span>${LOD.value}</span>
                        </th>
                        `
                    // IMG 
                    htmlListIMG += `<td><img src="${URL_IMG_LOD + LOD.fileName}"/></td>`;
                    if(indexLOD === lengthLOD) {
                        htmlListIMG += '</tr>';
                    }
                });
                htmlTemplate += `</thead>
                        <tbody>
                            ${htmlListIMG}
                        </tbody>
                        <tfoot ><tr><td>Data List</td><td colspan="999"style="border-right: none;">* more information about the element available on LOD Platform</td></tr></tfoot>
                    </table>
                </div>
                `;
                // footer and Page 
                htmlTemplate += `
                    <div class="footer">
                        <p>All information about the element including classifiction, rules for modeling and download links is available on the website</p>
                        <p><a href="https://hbreavis.com/lodplatform/elements/mechanical/ventilation/plant/ahu.html">https://hbreavis.com/lodplatform/elements/mechanical/ventilation/plant/ahu.html</a></p>   
                    </div>
                    <br><div style="page-break-after:always;"></div>
                `;
                if(indexBIM === lengthBIM) {
                    htmlTemplate += '</body></html>';
                    resolve();
                }
                    
                
                
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
                    options:{ sort:{value : 1}}
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