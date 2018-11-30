const fs = require('fs'),
    pdf = require('html-pdf'),
    PATH_FILEUPDATE_PDF = './FILE-UPLOAD/PDF/',
    PATH_FILEUPDATE_IMG = './FILE-UPLOAD/IMG/';

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

function checkString(value) {
    if(typeof value !== 'string' || value.trim() === '')
        return false;
    return true;
}

module.exports = (req, res) => {
    
    let htmlTemplate = `
        <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <style type="text/css">
                    body {
                        margin: 10px;
                        padding: 0;
                        font-size: 8px;
                        font-family: Arial;
                    }

                    .header {
                        background-color: #ddd;
                        position: relative;
                        z-index: 1;
                    }

                    .header td {
                        border: none;
                        font-size: 8px;
                    }

                    .logo {
                        float: right;
                    }

                    .clearfix {
                        content: "";
                        clear: both;
                        display: table;
                    }

                    .dataBasic {
                        float: left;
                    }

                    .dataBasic .value {
                        padding-left: 50px;
                    }

                    .content {
                        padding-top: 20px;
                    }

                    .content table,
                    th,
                    td {
                        border: 1px solid black;
                        font-size: 8px;
                        font-weight: normal;
                        font-family: Arial;
                    }

                    .content table {
                        border: 1px solid black;
                        border-collapse: collapse;
                        width: 100%;
                    }

                    table img {
                        max-width: 100%;
                        min-height: 100px;
                        min-witdh:  100px;
                        width: auto;
                        /* ie8 */
                    }

                    .footer {
                        font-size: 8px;
                        position: relative;
                        z-index: 1;
                        background-color: gray;
                        margin-top: 5px;
                        font-family: Arial;
                    }

                </style>
            </head>
            <body>
        `;
    let htmlHeader = '';
    let htmlHBRLOD = '';
    let htmlGeometry = '';
    let htmlDescription = '';
    let htmlParameters = '';
    let htmlTfoot = `<tfoot ><tr><td>Data List</td><td colspan="999"style="border-right: none;">* more information about the element available on LOD Platform</td></tr></tfoot>`;
    let htmlFooter =`<div class="footer">
                        <p>All information about the element including classifiction, rules for modeling and download links is available on the website</p>
                        <p><a href="https://hbreavis.com/lodplatform/elements/mechanical/ventilation/plant/ahu.html">https://hbreavis.com/lodplatform/elements/mechanical/ventilation/plant/ahu.html</a></p>   
                    </div>`;

    let dataBIM = [];
    let listDataBaseIMG = {}
      
    async function execute() {
        await  getListBIM();
        await writeHTML();
        let pathFile = PATH_FILEUPDATE_PDF + Date.now() + '.pdf';
        await exportFilePDF(pathFile);
        return res.download(pathFile);
    }

    execute();

    function getListBIM() {
        return new Promise(function (resolve, reject) {
            // let dataQuery = req.query.data;
            try {
                // var jsonBIM = JSON.parse(dataQuery);

                var jsonBIM = 
                {
                    "status": "New",
                    "_id": "5ba8ce6f11343927ec99974f",
                    "descriptions": [
                        {
                            "_id": "5ba8cea711343927ec99977f",
                            "description": "<p class=\"ql-indent-1\">des any format</p><ol><li class=\"ql-indent-1\">fsdf</li><li class=\"ql-indent-1\"><strong>important</strong></li><li class=\"ql-indent-1\"><strong>last one</strong></li></ol>",
                            "lodLevels": {
                                "LOD100": true,
                                "LOD200": false,
                                "LOD300": true,
                                "LOD350": true,
                                "LOD400": true
                            }
                        },
                        {
                            "_id": "5ba8cea711343927ec99977e",
                            "description": "<p>cdfcsd</p>",
                            "lodLevels": {
                                "LOD100": false,
                                "LOD200": true,
                                "LOD300": false,
                                "LOD350": false,
                                "LOD400": false
                            }
                        },
                        {
                            "_id": "5bac8436c81955145c391ce1",
                            "description": "<p>new desc rpipt</p><p><br></p><p><em>sdfsdfseee</em></p>",
                            "lodLevels": {
                                "LOD100": true,
                                "LOD200": true,
                                "LOD300": true,
                                "LOD350": false,
                                "LOD400": false
                            }
                        },
                        {
                            "_id": "5bffafda9528c52f94eb1832",
                            "description": "<p>Last one <em>description</em></p>",
                            "lodLevels": {
                                "LOD100": true,
                                "LOD200": false,
                                "LOD300": true,
                                "LOD350": false,
                                "LOD400": true
                            }
                        }
                    ],
                    "parameters": [
                        {
                            "_id": "5ba8cea711343927ec999781",
                            "lodLevels": {
                                "LOD100": true,
                                "LOD200": false,
                                "LOD300": false,
                                "LOD350": false,
                                "LOD400": false
                            },
                            "category_id": {
                                "_parents": [
                                    "5b755d8de51c5e1f8057209d"
                                ],
                                "_paths": [
                                    "5b755d8de51c5e1f8057209d#5ba35c5ab5ab4822f4a29736"
                                ],
                                "_id": "5ba35c5ab5ab4822f4a29736",
                                "term": "Size",
                                "additionalParameters": "",
                                "__v": 0
                            },
                            "subcategory_id": {
                                "_parents": [
                                    "5ba35c5ab5ab4822f4a29736"
                                ],
                                "_paths": [
                                    "5b755d8de51c5e1f8057209d#5ba35c5ab5ab4822f4a29736#5ba35cf1b5ab4822f4a2973c"
                                ],
                                "_id": "5ba35cf1b5ab4822f4a2973c",
                                "term": "volume",
                                "additionalParameters": {
                                    "unit": "m34",
                                    "note": "Example: 423"
                                },
                                "__v": 0
                            }
                        },
                        {
                            "_id": "5ba8cea711343927ec999780",
                            "lodLevels": {
                                "LOD100": false,
                                "LOD200": true,
                                "LOD300": false,
                                "LOD350": false,
                                "LOD400": false
                            },
                            "category_id": {
                                "_parents": [
                                    "5b755d8de51c5e1f8057209d"
                                ],
                                "_paths": [
                                    "5b755d8de51c5e1f8057209d#5bc86d666b38bf1b00c86cf7"
                                ],
                                "_id": "5bc86d666b38bf1b00c86cf7",
                                "__v": 0,
                                "term": "Shape"
                            },
                            "subcategory_id": {
                                "_parents": [
                                    "5bc86d666b38bf1b00c86cf7"
                                ],
                                "_paths": [
                                    "5b755d8de51c5e1f8057209d#5bc86d666b38bf1b00c86cf7#5bc86d766b38bf1b00c86cf9"
                                ],
                                "_id": "5bc86d766b38bf1b00c86cf9",
                                "additionalParameters": {
                                    "unit": "",
                                    "note": "note 7"
                                },
                                "__v": 0,
                                "term": "Rectangle"
                            }
                        },
                        {
                            "_id": "5bffafda9528c52f94eb1838",
                            "lodLevels": {
                                "LOD100": true,
                                "LOD200": true,
                                "LOD300": false,
                                "LOD350": true,
                                "LOD400": false
                            },
                            "info": "",
                            "imageLink": "",
                            "category_id": {
                                "_parents": [
                                    "5b755d8de51c5e1f8057209d"
                                ],
                                "_paths": [
                                    "5b755d8de51c5e1f8057209d#5bc881ae1dd1a9135455e887"
                                ],
                                "_id": "5bc881ae1dd1a9135455e887",
                                "__v": 0,
                                "term": "Mass"
                            },
                            "subcategory_id": {
                                "_parents": [
                                    "5bc881ae1dd1a9135455e887"
                                ],
                                "_paths": [
                                    "5b755d8de51c5e1f8057209d#5bc881ae1dd1a9135455e887#5bed6c61ceb5f1297cb213fa"
                                ],
                                "_id": "5bed6c61ceb5f1297cb213fa",
                                "additionalParameters": {
                                    "unit": "",
                                    "note": "nie serial"
                                },
                                "__v": 0,
                                "term": "Red dwarf"
                            }
                        },
                        {
                            "_id": "5bffafda9528c52f94eb1837",
                            "lodLevels": {
                                "LOD100": true,
                                "LOD200": true,
                                "LOD300": false,
                                "LOD350": true,
                                "LOD400": false
                            },
                            "info": "",
                            "imageLink": "",
                            "category_id": {
                                "_parents": [
                                    "5b755d8de51c5e1f8057209d"
                                ],
                                "_paths": [
                                    "5b755d8de51c5e1f8057209d#5bc881ae1dd1a9135455e887"
                                ],
                                "_id": "5bc881ae1dd1a9135455e887",
                                "__v": 0,
                                "term": "Mass"
                            },
                            "subcategory_id": {
                                "_parents": [
                                    "5bc881ae1dd1a9135455e887"
                                ],
                                "_paths": [
                                    "5b755d8de51c5e1f8057209d#5bc881ae1dd1a9135455e887#5bc881d21dd1a9135455e889"
                                ],
                                "_id": "5bc881d21dd1a9135455e889",
                                "additionalParameters": {
                                    "unit": "",
                                    "note": "Lorem ipsum dolor sit amet nullam sodales."
                                },
                                "__v": 0,
                                "term": "Black hole ren",
                                "value": "Black hole ren"
                            }
                        },
                        {
                            "_id": "5bffafda9528c52f94eb1836",
                            "lodLevels": {
                                "LOD100": false,
                                "LOD200": false,
                                "LOD300": false,
                                "LOD350": false,
                                "LOD400": false
                            },
                            "info": "",
                            "imageLink": "",
                            "category_id": {
                                "_parents": [
                                    "5b755d8de51c5e1f8057209d"
                                ],
                                "_paths": [
                                    "5b755d8de51c5e1f8057209d#5bc8835f27d6d1274c281131"
                                ],
                                "_id": "5bc8835f27d6d1274c281131",
                                "__v": 0,
                                "term": "Color"
                            },
                            "subcategory_id": {
                                "_parents": [
                                    "5bc8835f27d6d1274c281131"
                                ],
                                "_paths": [
                                    "5b755d8de51c5e1f8057209d#5bc8835f27d6d1274c281131#5bc8837c27d6d1274c281133"
                                ],
                                "_id": "5bc8837c27d6d1274c281133",
                                "additionalParameters": {
                                    "unit": "",
                                    "note": ""
                                },
                                "__v": 0,
                                "term": "Green"
                            }
                        }
                    ],
                    "images": [
                        {
                            "date": "2018-09-26T11:33:22.938Z",
                            "_id": "5bab6e88c81955145c391c81",
                            "link": "/upload/images/image-5d31c3420ff71fd840c6ae16b0cc2dc0.png",
                            "lodLevels": {
                                "LOD100": true,
                                "LOD200": false,
                                "LOD300": false,
                                "LOD350": false,
                                "LOD400": false
                            },
                            "name": "qr-code (20).png"
                        },
                        {
                            "date": "2018-09-25T08:43:29.518Z",
                            "_id": "5ba9f53cf3e74945b896cdfe",
                            "link": "/upload/images/image-fbd73bf338d90564859bcac1e82aaa78.png",
                            "lodLevels": {
                                "LOD100": true,
                                "LOD200": true,
                                "LOD300": true,
                                "LOD350": false,
                                "LOD400": false
                            },
                            "name": "qr-code (19)dd.png"
                        },
                        {
                            "date": "2018-09-26T14:34:34.408Z",
                            "_id": "5bab98ffc81955145c391cdb",
                            "link": "/upload/images/image-d2bcd38932f19c21ee06f4c7eaa0c657.png",
                            "lodLevels": {
                                "LOD100": false,
                                "LOD200": false,
                                "LOD300": true,
                                "LOD350": false,
                                "LOD400": false
                            },
                            "name": "2593.png"
                        }
                    ],
                    "bimModelName": "Populate everything",
                    "cenkrosCode": "8546.684.4",
                    "designerCode": "",
                    "readableLink": "populate-everything",
                };
                if(Array.isArray(jsonBIM) === false) // Detail BIM change List BIM
                    dataBIM.push(jsonBIM);
                else
                    dataBIM = jsonBIM;
                resolve();
         
            } catch (error) {
                console.log(error);
                return res.status(403).send({message: 'Json Format Error'});
               
            }
        });
    }

    function getListLOD(BIM) { //Get List LOD
        return new Promise(function (resolve, reject) {
            let attributeRequire = ['descriptions', 'parameters', 'images'];
            let lengthAttributeRequire = attributeRequire.length ;
            let indexAttribtue = 0;
            let listLODDefault = ['LOD100', 'LOD200', 'LOD300', 'LOD350', 'LOD400'];
            function getValueLOD() {
                if(indexAttribtue < lengthAttributeRequire) {
                    let nameAttribute = attributeRequire[indexAttribtue];
                    let valueAttribute = BIM[nameAttribute];
                    if(Array.isArray(valueAttribute) === false || typeof valueAttribute[0]['lodLevels']  !== 'object') {
                        ++indexAttribtue;
                        return getValueLOD();
                    }else {
                        return Object.keys(valueAttribute[0]['lodLevels']);
                    }
                } else
                    return listLODDefault;
            } 
           
            resolve(getValueLOD());
        });
    }

    function writeHTML() {
        return new Promise(function (resolve, reject) {
            let lengthBIM = dataBIM.length -1 ;
            asyncForEach(dataBIM,async (BIM, indexBIM) => {
               
                let listLOD =  await getListLOD(BIM); // List LOD detail BIM
             
                // let writeHeader =  writeHeader(BIM);
                htmlHeader = '';
                htmlHBRLOD = '';
                htmlGeometry = '';
                htmlDescription = '';
                htmlParameters = '';

                await Promise.all([
                    writeHeader(BIM),
                    writeHBRLOD(listLOD),
                    writeGeometry(BIM['images'], listLOD),
                    writeDescription(BIM['descriptions'], listLOD),
                    writeParameters(BIM['parameters'], listLOD)
                ]); //Asynchronous processing, to speed up time
         
                htmlTemplate +=`
                    ${htmlHeader}
                    <div class="content">
                        <table>
                            <thead>
                                ${htmlHBRLOD}
                            </thead>
                            <tbody>
                                <tr>${htmlGeometry}</tr>
                                <tr>${htmlDescription}</tr>
                                ${htmlParameters}
                            </tbody>
                            ${htmlTfoot}
                        </table>
                    </div>
                    ${htmlFooter}
                `;
                if (indexBIM === lengthBIM) {
                    htmlTemplate += '</body></html>';
                    resolve();
                }else {
                    // Create Page New
                    htmlTemplate +=' <br><div style="page-break-after:always;"></div>'
                }
               
            });
        });
    }

    function writeHeader(BIM) {
        return new Promise(function (resolve, reject) {
            htmlHeader = `
                <div class="header">
                    <div class="logo">
                        <h1>Logo</h1>
                    </div>
                    <div class="dataBasic">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td class="value">${BIM.bimModelName || ''}</td>
                                </tr>
                                <tr>
                                    <td>Designer code</td>
                                    <td class="value">${BIM.designerCode || ''}</td>
                                </tr>
                                <tr>
                                    <td>Cenkros code</td>
                                    <td class="value">${BIM.cenkrosCode || ''}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="clearfix"></div>
                </div>
            `;
            resolve();
        });
    }

    function  writeHBRLOD(listLOD) {
        return new Promise(function (resolve, reject) { 
            htmlHBRLOD = `
            <th style="width:75px;">
                HBR LOD Level
            </th>`;
            listLOD.forEach(nameLOD => {
                htmlHBRLOD += `
                <th></th>
                <th style="width: 20px;">${nameLOD.replace('LOD','')}</th>`;
            });
            resolve();
        });
    }

    function writeGeometry(images, listLOD){
        return new Promise(function (resolve, reject) { 
           
            let listOBJIMG = {};
            listLOD.forEach (nameLOD => {
                listOBJIMG[nameLOD] = 'noImage.png';
            });
            
            if(Array.isArray(images)) {
                images.forEach(dataIMG => {
                    if(typeof dataIMG['lodLevels'] === 'object') {
                        let dataLOD =  dataIMG['lodLevels'];
                        listLOD.forEach (nameLOD => {

                           if(listOBJIMG[nameLOD] === 'noImage.png' 
                            && dataLOD[nameLOD] === true
                            && checkString(dataIMG['name']) === true
                            ) { // get image first LOD
                                listOBJIMG[nameLOD] = dataIMG['name'];
                           }
                        });   
                    }
                });
            }

            let listArrayIMG = Object.values(listOBJIMG);
            let lengthListIMG = listArrayIMG.length - 1;
            htmlGeometry = '<td>Geometry</td>';
            asyncForEach(listArrayIMG,async (nameIMG, indexIMG) => {
                let base64IMG = await fileTOBase64(nameIMG);
                htmlGeometry +=  `<td colspan="2"><img align="center" src="data:image/png;base64, ${base64IMG}"/></td>`;
                if(indexIMG === lengthListIMG)
                resolve();
            });

        });
    }

    function fileTOBase64(fileName) {
        return new Promise(function (resolve, reject) {
            if(listDataBaseIMG[fileName] !== undefined) {//file changed  
                resolve(listDataBaseIMG[fileName]);
            }else {
                let pathFileIMG = PATH_FILEUPDATE_IMG + fileName;
                if (!fs.existsSync(pathFileIMG)) {
                    pathFileIMG = PATH_FILEUPDATE_IMG + 'noImage.png'
                }
                fs.readFile(pathFileIMG, function read(err, data) {
                    if (err) {
                        return res.status(403).send(err);
                    }
                    listDataBaseIMG[fileName] = new Buffer(data).toString('base64');
                    resolve(listDataBaseIMG[fileName]);
                });
            }
        });
    }

    function writeDescription(descriptions, listLOD) {
        return new Promise(function (resolve, reject) {
            let listOBJDesc = {};
            listLOD.forEach(nameLOD => {
                listOBJDesc[nameLOD] = '';
            });
            if (Array.isArray(descriptions)) {
                descriptions.forEach(dataDesc => {
                    if (typeof dataDesc['lodLevels'] === 'object') {
                        let dataLOD = dataDesc['lodLevels'];
                        listLOD.forEach(nameLOD => {
                            if (dataLOD[nameLOD] === true
                                && checkString(dataDesc['description']) === true
                            ) { 
                                listOBJDesc[nameLOD] += dataDesc['description'];
                            }
                        });
                    }
                });
            };

            let listArrayDesc = Object.values(listOBJDesc);
            let lengthListDesc = listArrayDesc.length - 1;
            htmlDescription = '<td>Description</td>';
            asyncForEach(listArrayDesc, async (valueDesc, indexDesc) => {
                htmlDescription += `<td colspan="2" style="min-height:100px;">${valueDesc}</td>`
                if (indexDesc === lengthListDesc)
                    resolve();
            });
        });
    }

    function writeParameters(parameters, listLOD) {
        return new Promise(function (resolve, reject) {
            let listOBJParam = {};
            listLOD.forEach(nameLOD => {
                listOBJParam[nameLOD] = [];
            });

            if (Array.isArray(parameters)) {
                parameters.forEach(dataParam => {
                    if (typeof dataParam['lodLevels'] === 'object') {
                        let dataLOD = dataParam['lodLevels'];
                        listLOD.forEach(nameLOD => {
                            if (dataLOD[nameLOD] === true
                                && typeof dataParam['subcategory_id'] === 'object'
                               ) {
                                listOBJParam[nameLOD].push(`
                                    <td style="min-width: 100px;">${dataParam['subcategory_id']['term'] || ''}</td>
                                    <td style="min-width: 20px;">${dataParam['unit'] || ''}</td>
                                    `);
                            }
                        });
                    }
                });
            };

            let maxLenghtParam = 0;
            listLOD.forEach(nameLOD => {
                if(maxLenghtParam < listOBJParam[nameLOD].length)
                maxLenghtParam = listOBJParam[nameLOD].length;
            });

            
            htmlParameters = `<tr><td rowspan="${maxLenghtParam}">Parameters</td>`;
            if(maxLenghtParam > 0) {
                let indexParam = 0;
                for(indexParam = 0 ; indexParam < maxLenghtParam; indexParam ++ ) {
                    if(indexParam > 0)
                    htmlParameters += '<tr>';
                    listLOD.forEach(nameLOD => {
                        let valueParam = listOBJParam[nameLOD][indexParam];
                        if(valueParam === undefined)
                            valueParam = '<td style="min-width: 100px;"></td><td style="min-width: 20px;"></td>';
                        htmlParameters += valueParam;
                    });
                    htmlParameters += '</tr>';

                }
            } else {

                listLOD.forEach(nameLOD => {
                    valueParam = '<td style="min-width: 100px;"></td><td style="min-width: 20px;"></td>';
                });
                valueParam += '</tr>';
            }
            
            // return res.status(403).send({htmlParameters});

            resolve();
        });
    }

    function exportFilePDF(pathFile) {
        return new Promise(function (resolve, reject) {
            let writeStream = fs.createWriteStream(pathFile);
            pdf.create(htmlTemplate, { format: 'A4', orientation: 'landscape' }).toStream(function (err, stream) {
                stream.pipe(writeStream);
            });
            writeStream.on('finish', function () {
                resolve();
            });
        });
    }

}