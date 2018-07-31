(function () {
  'use strict';

  angular
    .module('app.home')
    .config(homeRoutes);

  function homeRoutes($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        cache: false,
        controller: 'HomeController',
        templateUrl: 'app/home/home.html',
        controllerAs: 'vm',
      });
  }

})();
