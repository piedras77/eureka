(function () {
  'use strict';

  angular
    .module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/home');
    });
})();
