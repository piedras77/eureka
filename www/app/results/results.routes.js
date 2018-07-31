(function () {
  'use strict';

  angular
    .module('app.results')
    .config(resultsRoutes);

  function resultsRoutes($stateProvider) {
    $stateProvider
      .state('results', {
        url: '/results',
        templateUrl: 'app/results/results.html',
        controller: 'ResultsController',
        controllerAs: 'vm',
        cache: false,
      });
  }
})();
