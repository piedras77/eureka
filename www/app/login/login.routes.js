(function () {
  'use strict';

  angular
    .module('app.login')
    .config(loginRoutes);

  function loginRoutes($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm',
        cache: false,
      });
  }
})();
