(function () {
  'use strict';

  angular
    .module('app.signup')
    .controller('SignupController', SignupController);

  function SignupController($state,
                            $ionicPopup,
                            $scope,
                            sessionService,
                            apiService,
                            facebookService) {
    var _this = this;
    _this.signUp = signUp;
    _this.loginWithFacebook = loginWithFacebook;
    _this.goToHome = goToHome;
    _this.setGender = setGender;
    _this.user = {facebook: false, gender: 0};
    _this.levelInfo = ['Principiante', 'Principiante-Intermedio', 'Principiante-Avanzado', 'Intermedio-Básico', 'Intermedio-Medio', 'Intermedio-Avanzado'
      , 'Avanzado-Básico', 'Avanzado-Intermedio', 'Avanzado'];

    function signUp() {
      _this.user.password = _this.user.password1;
      _this.user.signup_time = new Date().toString();
      delete _this.user.password1;
      delete _this.user.password2;
      apiService.selectLevel(_this.user);
    }

    function loginWithFacebook() {
      // https://developers.facebook.com/tools/explorer?method=GET&path=me%3Ffields%3Dfriends&version=v2.9
      facebookService.login();
    }
    
    function goToHome() {
      $state.go('home');
    }

    function message(title, message) {
      $ionicPopup.alert({
        title: title,
        template: message,
        cssClass: 'align-center',
      });
    }

    function setGender() {
      _this.user.gender = _this.user.gender == 0 ? 1 : 0;
    }

  }
})();
