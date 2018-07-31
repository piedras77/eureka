(function () {
  'use strict';

  angular
    .module('app.about-app')
    .controller('AboutAppController', AboutAppController);

  function AboutAppController($state,
                              TEXT) {
    var _this = this;
    _this.goToMain = goToMain;
    _this.texts = TEXT;

    function goToMain() {
      $state.go('main');
    }
  }
})();
