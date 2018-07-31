(function () {
  'use strict';

  angular
    .module('app.signup')
    .controller('SignupController', SignupController);

  function SignupController($state,
                            $ionicPopup,
                            $scope,
                            sessionService) {
    var _this = this;
    _this.signUp = signUp;
    _this.goToHome = goToHome;
    _this.setGender = setGender;
    _this.user = {facebook: false, gender: 0};
    _this.levelInfo = ['Principiante', 'Principiante-Intermedio', 'Principiante-Avanzado', 'Intermedio-Básico', 'Intermedio-Medio', 'Intermedio-Avanzado'
      , 'Avanzado-Básico', 'Avanzado-Intermedio', 'Avanzado'];

    function signUp() {
      //TODO: implement database
      handleSuccess();
    }

    function handleSuccess() {
      _this.user.password = _this.user.password1;
      localStorage.setItem('shareMessage', true);
      selectLevel();
    }

    function selectLevel() {
      $ionicPopup.alert({
        title: 'Nivel actual de Inglés',
        scope: $scope,
        cssClass: "radio-input",
        template: '<div class="list"><label class="item" ng-repeat="level in vm.levelInfo"><input class="input" ng-model="vm.selectedLevel" ng-value="level" type="radio">{{level}}</label></div>'
      }).then(function (){
        switch(_this.selectedLevel) {
          case _this.levelInfo[0]:
            _this.user.points = 3;
          break;
          case _this.levelInfo[1]:
            _this.user.points = 10;
          break;
          case _this.levelInfo[2]:
            _this.user.points = 39;
          break;
          case _this.levelInfo[3]:
            _this.user.points = 67;
          break;
          case _this.levelInfo[4]:
            _this.user.points = 123;
          break;
          case _this.levelInfo[5]:
            _this.user.points = 209;
          break;
          case _this.levelInfo[6]:
            _this.user.points = 303;
          break;
          case _this.levelInfo[7]:
            _this.user.points = 427;
          break;
          case _this.levelInfo[8]:
            _this.user.points = 590;
          break;
        }


        _this.user.level = Math.ceil(3.24 * Math.sqrt(_this.user.points) / 10);
      sessionService.setCurrentUser(_this.user);
      message('Usuario Creado', 'Hemos creado su usuario');
      $state.go('main');
      });
    }

    function handleError() {
      // message()
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
