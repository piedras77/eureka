(function () {
  'use strict';

  angular
    .module('app.progress')
    .config(progressRoutes);

  function progressRoutes($stateProvider) {
    $stateProvider
      .state('progress', {
        url: '/progress',
        templateUrl: 'app/progress/progress.html',
        controller: 'ProgressController',
        controllerAs: 'vm',
        cache: false,
      });
  }
})();
