(function () {
  'use strict';

  angular
    .module('app.fill-text')
    .config(classifyRoutes);

  function classifyRoutes ($stateProvider) {
    $stateProvider
      .state('classify', {
        url: '/classify',
        templateUrl: 'app/classify/classify.html',
        controller: 'ClassifyController',
        controllerAs: 'vm',
        cache: false,
      });
  }  
})();
