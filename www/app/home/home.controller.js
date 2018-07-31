(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  /* @ngInject */
  function HomeController($state,
                          TEXT) {
    var _this = this;
    _this.texts = TEXT;
    _this.logIn = logIn;
    _this.signUp = signUp;

    function logIn() {
      $state.go('login');
    }

    function signUp() {
      $state.go('signup');
    }
  }
})();
