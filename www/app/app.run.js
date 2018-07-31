(function () {
  'use strict';

  angular
    .module('app')
    .run(run);

  /* @ngInject */
  function run($ionicPlatform, CORE, $state, sessionService) {
    $ionicPlatform.ready(function () {

      if (sessionService.getCurrentUser()) {
        $state.go('main');
      }

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      if(!localStorage.getItem('myTexts')) {
        sessionService.setMyTexts(CORE.DEFAULT_TEXTS);
      }
    });
  }

})();
