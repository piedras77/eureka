(function () {
  'use strict';

  angular
    .module('app.main')
    .config(mainRoutes);

  function mainRoutes($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm',
        cache: false,
      })
  }
})();
