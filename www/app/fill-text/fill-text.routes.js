(function () {
  'use strict';

  angular
    .module('app.fill-text')
    .config(FillRoutes);

  function FillRoutes ($stateProvider) {
    $stateProvider
      .state('fill-text', {
        url: '/fill-text',
        templateUrl: 'app/fill-text/fill-text.html',
        controller: 'FillController',
        controllerAs: 'vm',
        cache: false,
      });
  }  
})();
