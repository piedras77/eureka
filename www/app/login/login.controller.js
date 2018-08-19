(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('LoginController', LoginController);

  function LoginController($state,
                           CORE,
                           facebookService,
                           apiService,
                           TEXT
                           ) {
    var _this = this;
    _this.goToHome = goToHome;
    _this.logIn = logIn;
    _this.loginWithFacebook = loginWithFacebook;
    _this.texts = TEXT;

    function goToHome() {
      $state.go('home');
    }

    function logIn() {
      apiService.login(_this.user);
    }

    function loginWithFacebook() {
      // https://developers.facebook.com/tools/explorer?method=GET&path=me%3Ffields%3Dfriends&version=v2.9
      facebookService.login();
    }
  }
})();
