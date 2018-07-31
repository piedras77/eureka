(function () {
  'use strict';

  angular
    .module('app')
    .service('facebookService', facebookService);

  function facebookService( $cordovaFacebook,
                            $ionicLoading,
                            $ionicPopup,
                            $state,
                            sessionService) {
    var service = {
      login: login,
      fromProgress: false,
    };

    return service;

    function login() {
      // $ionicLoading.show();
      $cordovaFacebook.getLoginStatus('is user logged?')
        .then(function (response) {
          verifyStatus(response);
        });
    }

    function verifyStatus(response) {
      if (response.status != 'connected') {
        newUser();
      } else {
        recurrentUser();
      }
    }

    function recurrentUser() {
      var user = {};
      $cordovaFacebook.api('me?fields=friends,email,name,birthday,picture', null)
        .then(function (response) {
          //TODO: VALIDATE USER FROM DB
          user.name = response.name;
          user.email = response.email ? response.email : response.id;
          user.birthday = response.birthday;
          user.points = service.fromProgress ? service.previousUser.points : 1; // FROM OUR DB
          user.facebook = true;
          user.friends = response.friends.data;
          user.picture = "https://graph.facebook.com/" + user.email + "/picture?width=300&height=300";
          handleSuccessfulLogin(user);
      });
    }

    function setPronunciationWeights() {
      //todo: set from database
      localStorage.removeItem('pronunciationWeights');
    }

    function newUser() {
      $cordovaFacebook.login(['public_profile', 'user_friends', 'user_birthday', 'email'])
        .then(function (response) {
          if (response.status == 'connected') {
            recurrentUser();
          } else {
            handleInvalidLogin(user);
          }
        });
    }

    function handleSuccessfulLogin(user) {
      user.level = Math.ceil(3.24 * Math.sqrt(user.points) / 10);
      setPronunciationWeights();
      sessionService.setCurrentUser(user);
      localStorage.setItem('shareMessage', true);
      // $ionicLoading.hide();
      if (service.fromProgress) {
        $ionicPopup.alert({
          title: 'Bienvenido, ' + user.name,
          okType: 'dark'
        });
      }

      $state.go('main');
    }

    function handleInvalidLogin() {
      // $ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Registro Invalido',
        template: 'No pudimos registrarte, por favor intenta de nuevo',
      });
    }
  }
})();
