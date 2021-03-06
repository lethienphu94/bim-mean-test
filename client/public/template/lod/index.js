angular
    .module('homeApp')
    .controller(
        'LODController',
        [
            '$rootScope',
            '$http',
            '$window',
            'toastr',
            'getListLOD',
            LODController
        ]);

function LODController($rootScope, $http, $window, toastr, getListLOD) {
    var vm = this;
    $rootScope.titleWebsite = 'LOD';
    $rootScope.titleMenu = 'LOD';
    vm.dataForm = {};
    vm.listLOD = getListLOD.data;

    vm.sortBy = 'createAt';
    vm.dirSort = '';
    vm.isAPIPending = false;
    vm.URLAPI = URLAPI;
    vm.checkShowFilter = false;

    vm.attributeList = [
        { name: 'Name', value: 'name' },
        { name: 'Value', value: 'value' },
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
        vm.loadListLOD();
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
            vm.loadListLOD();
        } catch (error) {
            return toastr.warning('Filters are not empty !!!', 'Please wait!!!');
        }
    }

    vm.loadListLOD = function () {
        $('#loadingMask').show();
        if (vm.isAPIPending === true) {
            $('#loadingMask').hide();
            return toastr.warning('Please wait until all requests complete!', 'Please wait!!!');
        }
        vm.isAPIPending = true;
        $http.get(URLAPI + 'lod', {
            params: { dir: vm.dirSort, sortBy: vm.sortBy, condition: vm.condition },
        }).then(function (response) {
            $('#loadingMask').hide();
            vm.isAPIPending = false;
            vm.listLOD = response.data.data;
        }, function (response) {
            $('#loadingMask').hide();
            vm.isAPIPending = false;
            if (response.data !== null)
                toastr.error(response.data.message, 'Error message!!!');
            else
                toastr.error(response.data, 'Error message!!!');
        });
    }

    var ckeditorTemp = null;

    vm.clickModalUpdate = function (dataLOD) {
        if (ckeditorTemp || CKEDITOR.instances['descriptionCKedit'] !== undefined) {
            CKEDITOR.instances['descriptionCKedit'].destroy();
            CKEDITOR.remove('descriptionCKedit');
        }
        $('#loadingMask').show();

        if (dataLOD === undefined) { // Add LOD
            vm.dataForm = {
                id: '',
                name: '',
                value: 0,
                description:'',
                parameters:[]
            }
            $("#imgLOD").fileinput('destroy').fileinput({
                overwriteInitial: true,
                maxFileSize: 1500,
                showClose: false,
                showCaption: false,
                browseLabel: '',
                removeLabel: '',
                browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
                removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
                removeTitle: 'Cancel or reset changes',
                elErrorContainer: '#kv-avatar-errors-1',
                msgErrorClass: 'alert alert-block alert-danger',
                defaultPreviewContent: '<img src="public/img/default.jpg" alt="Image LOD">',
                layoutTemplates: { main2: '{preview} ' + ' {remove} {browse}' },
                allowedFileExtensions: ["jpg", "png", "gif", "svg"]
            });

        } else {
            var imgDefault = "public/img/default.jpg";
            if (dataLOD.fileName !== '')
                imgDefault = vm.URLAPI + 'lod/image/' + dataLOD.fileName;
            $('#imgLOD').fileinput('destroy').fileinput({
                overwriteInitial: true,
                maxFileSize: 1500,
                showClose: false,
                showCaption: false,
                browseLabel: '',
                removeLabel: '',
                browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
                removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
                removeTitle: 'Cancel or reset changes',
                elErrorContainer: '#kv-avatar-errors-1',
                msgErrorClass: 'alert alert-block alert-danger',
                defaultPreviewContent: '<img src="' + imgDefault + '" alt="Image LOD">',
                layoutTemplates: { main2: '{preview} ' + ' {remove} {browse}' },
                allowedFileExtensions: ["jpg", "png", "gif", "svg"]
            });

            vm.dataForm = angular.copy(dataLOD);
            vm.dataForm['id'] = dataLOD['_id'];
        }

        vm.dataForm['description'] = vm.dataForm['description'] || '';
        vm.dataForm['parameters'] = vm.dataForm['parameters'] || [];
        $('#updateDataModal').modal('show');
        setTimeout(() => {
            ckeditorTemp = CKEDITOR.replace('descriptionCKedit', {
                removeButtons: 'Image,Flash'
            });
            ckeditorTemp.setData(vm.dataForm['description']);
            $('#loadingMask').hide();
            
        }, 200);
    }

    vm.clickAddAttribute = function() {
        vm.dataForm.parameters.push({
            'attribute' : '',
            'value': ''
        });
    };

    vm.deleteOption = function (key) {
        vm.dataForm.parameters.splice(key, 1);
    };

    vm.clickUpdateLOD = function () {
        $('#loadingMask').show();
        var dataForm = angular.copy(vm.dataForm);
        dataForm.description = ckeditorTemp.getData();
        var checkError = false;
        if (typeof dataForm.name !== 'string' || dataForm.name.trim() === '') {
            checkError = true;
            toastr.error('Please enter a Name !!!', 'Error Message');
        }
        dataForm.value = dataForm.value << 0;
        if (dataForm.value <= 0) {
            checkError = true;
            toastr.error('Value must be greater than 0 !!!', 'Error Message');
        }

        var attributeCheck = [];
        var nameAttribute;
        angular.forEach(dataForm.parameters, function (dataAttribute) {
            nameAttribute = dataAttribute.attribute.trim();
            dataAttribute.attribute = nameAttribute;
            if (nameAttribute === '') {
                toastr.error('The name attribute cannot be empty', 'Message!');
                checkError = true;
            }

            if (attributeCheck.indexOf(nameAttribute) !== -1) {
                toastr.error('Attribute Duplicate: ' + nameAttribute + ' ', 'Message!');
                checkError = true;
            }
            attributeCheck.push(nameAttribute);
        });
        
        if (checkError === true) {
            $('#loadingMask').hide();
            return;
        }


        var fd = new FormData();
        fd.append('imgLOD', $('#imgLOD').fileinput('getFileStack')[0]);
        fd.append('id', dataForm.id);
        fd.append('name', dataForm.name);
        fd.append('parameters', JSON.stringify(dataForm.parameters));
        fd.append('description', dataForm.description);
        fd.append('value', dataForm.value);

        var methodHTTP = 'post';
        if (dataForm.id !== '')
            methodHTTP = 'put';

        $http[methodHTTP](URLAPI + 'lod', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined, }
        }).then(function (response) {
            setTimeout(() => {
                $('#updateDataModal').modal('hide');
                $('#loadingMask').hide();
                vm.loadListLOD();
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

        var answer = confirm("Do you want to delete this LOD ?");
        if (!answer) return;
        $('#loadingMask').show();
        $http.delete(URLAPI + 'lod', {
            params: { id: id }
        }).then(function (response) {
            $('#loadingMask').hide();
            setTimeout(function () {
                vm.loadListLOD();
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


    $('#condition').queryBuilder({
        allow_empty: true,
        rules: { rules: [] },
        filters: [
            { id: 'name', label: 'Name', type: 'string' },
            { id: 'value', label: 'value', type: 'double', validation: { min: 1, step: 1 } },
        ],
        plugins: [
            'sortable',
            'invert'
        ]
    });

}