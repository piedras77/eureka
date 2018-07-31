(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('LoginController', LoginController);

  function LoginController($state,
                           $ionicLoading,
                           $ionicPopup,
                           CORE,
                           TEXT,
                           sessionService,
                           facebookService
                           ) {
    var _this = this;
    _this.texts = TEXT;
    _this.goToHome = goToHome;
    _this.logIn = logIn;
    _this.loginWithFacebook = loginWithFacebook;
    //TODO: GET INFO FROM DATA BASE

    function goToHome() {
      $state.go('home');
    }

    function logIn() {
      $ionicLoading.show();
      var user = validateUser();
      if (user) {
        handleSuccessfulLogin(user);
      } else {
        handleInvalidLogin();
      }
    }

    function validateUser() {
      var testUsers = [
        {name: 'User level1', email: 'test1@erk.com', password: 'asd123', gender: 0, points: 8, facebook: false},
        {name: 'User level2', email: 'test2@erk.com', password: 'asd123', gender: 1, points: 16, facebook: false},
        {name: 'User level3', email: 'test3@erk.com', password: 'asd123', gender: 0, points: 57, facebook: false},
        {name: 'User level4', email: 'test4@erk.com', password: 'asd123', gender: 1, points: 115, facebook: false},
        {name: 'User level5', email: 'test5@erk.com', password: 'asd123', gender: 0, points: 190, facebook: false},
        {name: 'User level6', email: 'test6@erk.com', password: 'asd123', gender: 1, points: 305, facebook: false},
      ];

      for (var user in testUsers) {
        if (testUsers[user].email == _this.user.user && testUsers[user].password == _this.user.password) {
          return testUsers[user];
        }
      }

      return false;
    }

    function loginWithFacebook() {
      // https://developers.facebook.com/tools/explorer?method=GET&path=me%3Ffields%3Dfriends&version=v2.9
      facebookService.login();
    }

    function handleSuccessfulLogin(user) {
      user.level = Math.ceil(3.24 * Math.sqrt(user.points) / 10);
      sessionService.setCurrentUser(user);
      localStorage.setItem('shareMessage', true);
      $ionicLoading.hide();
      $state.go('main');
    }

    function handleInvalidLogin() {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: _this.texts.INVALID_LOGIN_TITLE,
        template: _this.texts.INVALID_LOGIN_MESSAGE,
      });
    }
  }
})();
