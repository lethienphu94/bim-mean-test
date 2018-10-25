const fs = require('fs'),
    pdf = require('html-pdf'),
    PATH_FILEUPDATE_PDF = './FILE-UPLOAD/PDF/',
    PATH_FILEUPDATE_IMG = './FILE-UPLOAD/IMG/'
    // URL_IMG = 'localhost:400/'



module.exports = (req, res) => {
    let URL_IMG_LOD = req.protocol + '://' + req.get('host') + '/api/v1/lod/image/' ;
    let htmlTemplate = `
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <style type="text/css">body {margin: 0;padding: 0;}.header {background-color: #ddd;position: relative;z-index: 1;}.header td {border: none;font-size: 8px;}.logo {float: right;}.clearfix {content: "";clear: both;display: table;}.dataBasic {float: left;}.dataBasic .value {padding-left: 50px;}.content {padding-top: 20px;}.content table,th,td {border: 1px solid black;font-size: 8px;font-weight: normal;}.content table {border: 2px solid black;border-collapse: collapse;width: 100%;}table img {max-width: 100%;max-height: 400px;width: auto;/* ie8 */}.footer {position: relative;z-index: 1;background-color: #ddd;margin-top: 10px;}.footer p {font-size: 8px;}</style>
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

    function readFileIMG (fileName) {
        return new Promise(function (resolve, reject) {
            let pathFileIMG = PATH_FILEUPDATE_IMG + fileName;

            if (!fs.existsSync(pathFileIMG)) {
                pathFileIMG = PATH_FILEUPDATE_IMG + 'noImage.png'
            }
            fs.readFile(pathFileIMG, function read(err, data) {
                
                if (err) {
                    return res.status(403).send(err);
                }
                resolve (new Buffer(data).toString('base64'));
            });
    
        });
    }

    function writeContenHTML(dataLOD) {
        return new Promise(function (resolve, reject) {
            //Thead Value LOD
            let lengthLOD = dataLOD.length - 1;
            let htmlListIMG = 
            `<tr>
                <td>Geometry</td>
            `;
            let htmlListDescription = 
            `<tr>
                <td>Description</td>
            `;


            let maxLenghtParam = 0;
            dataLOD.forEach( (LOD, indexLOD) => {
                let param = LOD.parameters;
                if (Array.isArray(param)) {
                    let lengthParam = param.length;
                    if (maxLenghtParam < lengthParam)
                        maxLenghtParam = lengthParam;
                }else
                dataLOD[indexLOD].parameters = [];
            });

            let htmlListParam = 
            `<tr>
                <td rowspan="${maxLenghtParam}">Parameters</td>
            `;

            if(maxLenghtParam > 0) {
                for( var iParam = 0 ; iParam < maxLenghtParam; iParam ++  ) {
                    if(iParam != 0)
                    htmlListParam += '<tr>';
                    for( var iLOD = 0; iLOD <=lengthLOD ; iLOD ++  ) {
                        let param = dataLOD[iLOD].parameters[iParam];
                        if(param === undefined) {
                            htmlListParam += '<td></td><td></td>';
                        }else {
                            htmlListParam += `<td>${param.attribute}</td><td>${param.value}</td>`;
                        }
                            
                    }
                    htmlListParam += '</tr>';
                }
            } else {
                for( var iLOD = 0; iLOD <=lengthLOD ; iLOD ++  ) {
                    if(iLOD != 0)
                        htmlListParam += '<tr>';
                    htmlListParam += '<td></td><td></td>';
                    htmlListParam += '</tr>';  
                }
            }
            

            asyncForEach(dataLOD,async (LOD, indexLOD) => {
                // Value LOD
                htmlTemplate += `
                    <th></th>
                    <th style="width: 30px;">${LOD.value}</th>
                    `
                let imgBase64 = await (readFileIMG (LOD.fileName) );
                htmlListIMG += `<td colspan="2"><img src="data:image/png;base64, ${imgBase64}"/></td>`;
                htmlListDescription += `<td style="min-width:100px;" colspan="2">${LOD.description}</td>`;

                if (indexLOD === lengthLOD) {
                    htmlListIMG += '</tr>';
                    htmlListDescription += '</tr>';
                    htmlListParam += '</tr>';
                   
                    htmlTemplate += `</thead>
                    
                        <tbody>
                            ${htmlListIMG}
                            ${htmlListDescription}
                            ${htmlListParam}
                        </tbody>
                            <tfoot ><tr><td>Data List</td><td colspan="999"style="border-right: none;">* more information about the element available on LOD Platform</td></tr></tfoot>
                        </table>
                    </div>
                `;
                    resolve();
                }
            });
         
           
        });
    }

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    function  writeHTML() {
        let lengthBIM = dataBIM.length -1 ;
     
        return new Promise(function   (resolve, reject) {

            asyncForEach(dataBIM,async (BIM, indexBIM) => {
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
                await writeContenHTML(BIM['lodLevels']);
                // // footer and Page 
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
                    select: 'fileName name value description parameters',
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