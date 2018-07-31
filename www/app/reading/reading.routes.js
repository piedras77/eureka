(function () {
  'use strict';

  angular
    .module('app.reading')
    .config(readingRoutes);

  function readingRoutes($stateProvider) {
    $stateProvider
      .state('reading', {
        url: '/reading',
        templateUrl: 'app/reading/reading.html',
        controller: 'ReadingController', 
        controllerAs: 'vm',
        cache: false,
      })
  }

})();
