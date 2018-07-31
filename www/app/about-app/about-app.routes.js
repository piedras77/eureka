(function () {
  'use strict';

  angular
    .module('app.about-app')
    .config(FillRoutes);

  function FillRoutes ($stateProvider) {
    $stateProvider
      .state('about-app', {
        url: '/about-app',
        templateUrl: 'app/about-app/about-app.html',
        controller: 'AboutAppController',
        controllerAs: 'vm',
        cache: false,
      });
  }
})();
