'use strict';

// Declare app level module which depends on views, and components
angular.module('onePush', [
  'ngRoute',
  'onePush.main'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/'});
}]);
