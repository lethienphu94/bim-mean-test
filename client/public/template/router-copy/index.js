//Dashboard
angular
   .module('homeApp')
   .controller(
      'DashboardController',
      [
         '$rootScope',
         '$http',
         '$location',
         '$q',
         '$window',
         'toastr',
         DashboardController
      ]);

function DashboardController($rootScope, $http, $location, $q, $window, toastr) {
   var vm = this;
   $rootScope.titleWebsite = 'Dashboard';
   $rootScope.titleMenu = 'Dashboard';

   vm.listDashboard = {};
}