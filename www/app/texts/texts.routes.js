(function () {
  'use strict';

  angular
    .module('app.texts')
    .config(TextsRoutes);

  function TextsRoutes($stateProvider) {
    $stateProvider
      .state('texts', {
        url: '/texts',
        templateUrl: 'app/texts/texts.html',
        controller: 'TextsController',
        controllerAs: 'vm',
        cache: false,
      });
  }
})();;
