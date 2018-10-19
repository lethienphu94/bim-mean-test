var homeApp = angular.module('homeApp', [
	'ui.router',
	'toastr',
	'oc.lazyLoad'
]);

homeApp.config([
	'$stateProvider',
	'$locationProvider',
	'$compileProvider',
	'$httpProvider',
	'toastrConfig',
	function ($stateProvider, $locationProvider, $compileProvider, $httpProvider, toastrConfig) {
		// $locationProvider.html5Mode(true);
		// $compileProvider.debugInfoEnabled(false);
		$httpProvider.useApplyAsync(500);
		angular.extend(toastrConfig, {
			closeButton: true,
			closeHtml: '<button>&times;</button>',
			extendedTimeOut: 1000,
			timeOut: 5000,
			positionClass: 'toast-top-full-width',
		});
		angular.module('ng').filter('tel', function () { });

	}
]);

homeApp
	.directive('fileModel', ['$parse', function ($parse) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;
				element.bind('change', function () {
					scope.$apply(function () {

						modelSetter(scope, element[0].files[0]);
					});
				});
			}
		};
	}]);
  

// Router
homeApp.config([
	'$stateProvider', '$urlRouterProvider', '$transitionsProvider',
	function ($stateProvider, $urlRouterProvider, $transitionsProvider) {

		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('BIMView', {
				controller: 'BIMController',
				controllerAs: 'vm',
				url: '/',
				templateUrl: 'public/template/bim/index.tpl.html',
				resolve: {
					css: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load([
							'public/css/querybuilder.css'
						]);
					}],
					js: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load([
							'public/js/querybuilder.js',
							'public/js/ckeditor/ckeditor.js'
						]);
					}],
					loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('public/template/bim/index.js');
					}],
					getListLOD: function ($http, $window, $q, $state, toastr) {
						var deferred = $q.defer();
						$http.get(URLAPI + 'lod')
							.then(function (response) {
								deferred.resolve(response.data);
							}, function (response) {
								if (response.data !== null)
									toastr.error(response.data.message, 'Error message!!!');
								else
									toastr.error(response.data, 'Error message!!!');
								// $state.go('DashboardView');
							});
						return deferred.promise;
					},
					getListBIM: function ($http, $window, $q, $state, toastr) {
						var deferred = $q.defer();
						$http.get(URLAPI + 'bim')
							.then(function (response) {
								deferred.resolve(response.data);
							}, function (response) {
								if (response.data !== null)
									toastr.error(response.data.message, 'Error message!!!');
								else
									toastr.error(response.data, 'Error message!!!');
								// $state.go('DashboardView');
							});
						return deferred.promise;
					},
				}
			})
			.state('LODView', {
				controller: 'LODController',
				controllerAs: 'vm',
				url: '/lod',
				templateUrl: 'public/template/lod/index.tpl.html',
				resolve: {
					css: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load([
							'public/css/fileinput.min.css',
							'public/css/querybuilder.css'
						]);
					}],
					js: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load([
							'public/js/fileinput.min.js',
							'public/js/querybuilder.js'
						]);
					}],
					loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('public/template/lod/index.js');
					}],
					getListLOD: function ($http, $window, $q, $state, toastr) {
						var deferred = $q.defer();
						$http.get(URLAPI + 'lod')
							.then(function (response) {
								deferred.resolve(response.data);
							}, function (response) {
								if (response.data !== null)
									toastr.error(response.data.message, 'Error message!!!');
								else
									toastr.error(response.data, 'Error message!!!');
								// $state.go('DashboardView');
							});
						return deferred.promise;
					},
				}
			})
	}
]);

var URLAPI = 'http://localhost:4000/api/v1/';

homeApp.controller('HomeController', function HomeController($rootScope, $scope, toastr, $http, $window) {
	var vm = this;
	$rootScope.title = 'Building Information Model';
	$('#loadingMask').hide();
});