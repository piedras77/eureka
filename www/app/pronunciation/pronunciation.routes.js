(function () {
  'use strict';

  angular
    .module('app.pronunciation')
    .config(pronunciationRoutes);

  function pronunciationRoutes($stateProvider) {
    $stateProvider
      .state('pronunciation', {
        url: '/pronunciation',
        templateUrl: 'app/pronunciation/pronunciation.html',
        controller: 'PronunciationController',
        controllerAs: 'vm',
        cache: false,
      })
  }
})();
