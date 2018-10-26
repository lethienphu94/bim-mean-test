var homeApp = angular.module('homeApp', ['toastr']);
homeApp.controller('HomeController', function HomeController($rootScope, $scope, toastr, $http, $window) {
	var vm = this;
    vm.jsonBIM = '';

    vm.jsonBIMDefault =
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
                "unit": "m3",
                "note": "Example: 42",
                "subcategory_id": {
                    "_id": "5ba35cf1b5ab4822f4a2973c",
                    "term": "volume",
                    "additionalParameters": {
                        "unit": "m3",
                        "note": "Example: 42"
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
                "unit": "my size",
                "note": "any",
                "subcategory_id": {
                    "_id": "5ba35d49b5ab4822f4a29740",
                    "term": "Shape specification",
                    "additionalParameters": {
                        "unit": "text",
                        "note": "Example: square / L shape / Rectangular"
                    },
                    "__v": 0
                }
            }
        ],
        "images": [
            {
                "date": "2018-09-26T11:33:22.938Z",
                "_id": "5bab6e88c81955145c391c81",
                "link": "/upload/images/image-5d31c3420ff71fd840c6ae16b0cc2dc0.png",
                "lodLevels": {
                    "LOD100": false,
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
                    "LOD100": false,
                    "LOD200": false,
                    "LOD300": false,
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
                    "LOD100": true,
                    "LOD200": false,
                    "LOD300": false,
                    "LOD350": false,
                    "LOD400": false
                },
                "name": "image1.png"
            }
        ],
        "bimModelName": "Populate everything",
        "cenkrosCode": "8546.684.4",
        "designerCode": "",
        "__v": 3,
        "readableLink": "populate-everything"
    };

    var URLAPI = 'http://localhost:4000/api/v1/';
    vm.clickSubmitPDF = function(){
        try {
            var jsonBIM = JSON.parse(vm.jsonBIM);
            var linkDownload = URLAPI + 'exportPDF?data='+vm.jsonBIM;
            window.open(linkDownload, '_blank', '');
        } catch (error) {
            console.log(error);
            toastr.error('Json Format Error', 'Error message!!!');
        }
    }

    vm.clickSetDefault = function() {
        var jsonTemp = angular.copy(vm.jsonBIMDefault);
        vm.jsonBIM = JSON.stringify(jsonTemp, null, '\t');
    }
});