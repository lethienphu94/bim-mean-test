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

    vm.loadListLOD = function () {
        $('#loadingMask').show();
        if (vm.isAPIPending === true) {
            $('#loadingMask').hide();
            return toastr.warning('Please wait until all requests complete!', 'Please wait!!!');
        }
        vm.isAPIPending = true;
        $http.get(URLAPI + 'lod', {
            params: { dir: vm.dirSort, sortBy: vm.sortBy },
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

    vm.clickModalUpdate = function (dataLOD) {
       
        if (dataLOD === undefined) { // Add LOD
            vm.dataForm = {
                id: '',
                name: '',
                value: 0
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
                layoutTemplates: {main2: '{preview} ' + ' {remove} {browse}'},
                allowedFileExtensions: ["jpg", "png", "gif", "svg"]
            });

        } else {
            var imgDefault = "public/img/default.jpg";
            if(dataLOD.fileName !== '')
                imgDefault = vm.URLAPI + 'lod/image/' + dataLOD.fileName ;
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
    }

    vm.clickUpdateLOD = function () {
        $('#loadingMask').show();
        var dataForm = angular.copy(vm.dataForm);
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
        if (checkError === true) {
            $('#loadingMask').hide();
            return;
        }
        var fd = new FormData();
        fd.append('imgLOD', $('#imgLOD').fileinput('getFileStack')[0]);
        fd.append('name', dataForm.name);
        fd.append('value', dataForm.value);

        var methodHTTP = 'post';
        if(dataForm.id !== 'put')


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




}