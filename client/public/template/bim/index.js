angular
    .module('homeApp')
    .controller(
        'BIMController',
        [
            '$rootScope',
            '$http',
            '$window',
            'toastr',
            'getListLOD',
            'getListBIM',
            BIMController
        ]);

function BIMController($rootScope, $http, $window, toastr, getListLOD, getListBIM) {
    var vm = this;
    $rootScope.titleWebsite = 'BIM';
    $rootScope.titleMenu = 'BIM';
    vm.dataForm = {};
    vm.listLOD = getListLOD.data;
    vm.listBIM = getListBIM.data;
    vm.sortBy = 'createAt';
    vm.dirSort = '';
    vm.isAPIPending = false;
    vm.URLAPI = URLAPI;
    vm.checkShowFilter = false;
    vm.condition = '';
    vm.attributeList = [
        { name: 'Name', value: 'name' },
        { name: 'Designer code', value: 'designerCode' },
        { name: 'Cenkros code', value: 'cenkrosCode' },
        // { name: 'SubCategory Term', value: 'parameters.sucategory_id.term' },
        // { name: 'Unit', value: 'parameters.unit' },
        { name: 'Date Update', value: 'updateAt' },
        { name: 'Date Create', value: 'createAt' },
    ];

    vm.clickSort = function (attribute) {
        if (vm.isAPIPending === true)
            return toastr.warning('Please wait until all requests complete!', 'Please wait!!!');
        if (attribute !== vm.sortBy) {
            vm.sortBy = attribute;
            vm.dirSort = 'asc';
        } else if (vm.dirSort === 'asc')
            vm.dirSort = 'desc';
        else
            vm.dirSort = 'asc';
        vm.loadListBIM();
    }

    vm.clickFilter = function () {
        vm.dirSort = '';
        vm.sortBy = '';
        try {
            var condition = $('#condition').queryBuilder('getMongo');
            vm.condition = JSON.stringify(condition);
            var ruleCondition = $('#condition').queryBuilder('getRules');
            if (ruleCondition.rules.length === 0)
                vm.condition = '{}';

            vm.loadListBIM();
        } catch (error) {
            return toastr.warning('Filters are not empty !!!', 'Please wait!!!');
        }
    }

    vm.clickExportPDF = function () {
        if (vm.isAPIPending === true) {
            return toastr.warning('Please wait until all requests complete!', 'Please wait!!!');
        }
        var linkDownload = URLAPI + 'bim/export-pdf?dir=' + vm.dirSort + '&sortBy=' + vm.sortBy + '&condition=' + vm.condition;
        window.open(linkDownload, '_blank', '');

    }

    vm.loadListBIM = function () {
        if (vm.isAPIPending === true) {
            return toastr.warning('Please wait until all requests complete!', 'Please wait!!!');
        }
        $('#loadingMask').show();
        vm.isAPIPending = true;
        $http.get(URLAPI + 'bim', {
            params: { dir: vm.dirSort, sortBy: vm.sortBy, condition: vm.condition },
        }).then(function (response) {
            $('#loadingMask').hide();
            vm.isAPIPending = false;
            vm.listBIM = response.data.data;
        }, function (response) {
            $('#loadingMask').hide();
            vm.isAPIPending = false;
            if (response.data !== null)
                toastr.error(response.data.message, 'Error message!!!');
            else
                toastr.error(response.data, 'Error message!!!');
        });
    }

    vm.clickModalUpdate = function (dataBIM) {
     
        vm.dataForm = {
            id: '',
            name: '',
            designerCode: '',
            cenkrosCode: '',
            lodLevels: [],
            description: '',
            term: '', //sub sucategory_id
            unit: ''
        }
        if (dataBIM !== undefined) { // Add LOD

            vm.dataForm = angular.copy(dataBIM);
            vm.dataForm['id'] = dataBIM['_id'];
            if (Array.isArray(dataBIM['lodLevels'])) {
                vm.dataForm['lodLevels'] = [];
                dataBIM['lodLevels'].forEach(dataLOD => {
                    vm.dataForm['lodLevels'].push(dataLOD._id.toString());
                });
            }

            vm.dataForm['unit'] = dataBIM['unitShow'];
            vm.dataForm['term'] = dataBIM['subCategoryTerm'];
        }
       
    }

    vm.clickUpdateBIM = function () {
        $('#loadingMask').show();
        var dataForm = angular.copy(vm.dataForm);
        var checkError = false;
        if (typeof dataForm.name !== 'string' || dataForm.name.trim() === '') {
            checkError = true;
            toastr.error('Please enter a Name !!!', 'Error Message');
        }
        

        if (checkError === true) {
            $('#loadingMask').hide();
            return;
        }

        var methodHTTP = 'post';
        if (dataForm.id !== '')
            methodHTTP = 'put';

        $http[methodHTTP](URLAPI + 'bim', dataForm)
            .then(function (response) {
                setTimeout(() => {
                    $('#updateDataModal').modal('hide');
                    $('#loadingMask').hide();
                    vm.loadListBIM();
                    toastr.success(response.data.message, 'Success message!!!');
                }, 300);
            }, function (response) {
                $('#loadingMask').hide();
                if (response.data !== null) {
                    if (response.data.message !== undefined)
                        toastr.error(response.data.message, 'Error message!!!');
                    else
                        toastr.error('Unknown error', 'Error message!!!');
                }
            });
    }

    vm.clickDelete = function (id) {

        var answer = confirm("Do you want to delete this BIM ?");
        if (!answer) return;
        $('#loadingMask').show();
        $http.delete(URLAPI + 'bim', {
            params: { id: id }
        }).then(function (response) {
            $('#loadingMask').hide();
            setTimeout(function () {
                vm.loadListBIM();
            }, 300);
            toastr.success(response.data.message, 'Success message!!!');
        }, function (response) {
            $('#loadingMask').hide();
            if (response.data !== null) {
                if (response.data.message !== undefined)
                    toastr.error(response.data.message, 'Error message!!!');
                else
                    toastr.error('Unknown error', 'Error message!!!');
            }
        });
    };

    var objLOD = {};
    vm.listLOD.forEach(function (dataLOD) {
        objLOD[dataLOD._id] = dataLOD.name + '( ' + dataLOD.value + ' )';
    });



    $('#condition').queryBuilder({
        allow_empty: true,
        rules: { rules: [] },
        filters: [
            { id: 'name', label: 'Name', type: 'string' },
            { id: 'designerCode', label: 'Designer code', type: 'string' },
            { id: 'cenkrosCode', label: 'Cenkros code', type: 'string' },
            // { id: 'parameters.sucategory_id.term', label: 'SubCategory Term', type: 'string' },
            // { id: 'parameters.unit', label: 'Unit', type: 'string' },
            { id: 'lodLevels', label: 'LOD', type: 'string', input: 'select', values: objLOD, },

        ],
        plugins: [
            'sortable',
            'invert'
        ]
    });


}