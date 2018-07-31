(function () {
  'use strict';

  angular
    .module('app.signup')
    .config(signupRoutes);

  function signupRoutes($stateProvider) {
    $stateProvider
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/signup/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm',
      })
  }
})();
