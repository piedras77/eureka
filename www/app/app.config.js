(function () {
  'use strict';

  angular
    .module('app')
    .config(config);

  /* @ngInject */
  function config($ionicConfigProvider) {
    $ionicConfigProvider.backButton.previousTitleText(false).text('');
  }
})();
