(function () {
  'use strict';

  angular
    .module('app')
    .service('facebookService', facebookService);

  function facebookService( $cordovaFacebook,
                            $ionicLoading,
                            $ionicPopup,
                            $state,
                            $rootScope,
                            sessionService,
                            apiService ) {
    var service = {
      login: login,
      fromProgress: false,
    };

    return service;

    function login() {
      $cordovaFacebook.getLoginStatus('is user logged?')
        .then(function (response) {
          if (response.status == 'connected') {
            recurrentUser();
          } else {
            newUser();
          }
        }, function(error) {
            apiService.handleInvalidLogin();
        });
    }

    function middlewareApiFacebook(user) {
      $ionicLoading.show(); 
      user.friends = user.friends.data;
      user.picture = "https://graph.facebook.com/" + user.id + "/picture?width=300&height=300";
      user.password = user.id;
      user.email = user.email ? user.email : user.id;
      user.facebook_id = user.id;      
      delete user.id;
      if (service.fromProgress) {
        service.previousUser.facebook = 1;
        service.previousUser.facebook_id = user.facebook_id;
        apiService.updateUser(service.previousUser)
          .then(function(response) {
            response.friends = user.friends;
            response.picture = user.picture;
            sessionService.setCurrentUser(response);
            $ionicLoading.hide();
            apiService.message( TEXT.FACEBOOK_CONNECT_TITLE, TEXT.FACEBOOK_CONNECT_MESSAGE );
            $state.go('main');
          }, function(error) {
            apiService.handleInvalidLogin();
          });
      } else {
          user.age = Math.floor( ( new Date().getTime() - new Date( user.birthday ).getTime() ) / 31536000000 );
          user.facebook = 1;
          user.gender = user.gender === 'male' ? 1 : 0
          user.signup_time = new Date().toString();
          user.last_login = new Date().toString();
          delete user.birthday;
          apiService.login(user);
      }
    }

    function recurrentUser() {
      var user = {};
      $cordovaFacebook.api('me?fields=friends,email,name,birthday,picture,gender', null)
        .then(function (response) {
          middlewareApiFacebook(response);
      }, function(error) {
            apiService.handleInvalidLogin();
      });
    }

    function newUser() {
      $cordovaFacebook.login(['public_profile', 'user_friends', 'user_birthday', 'email', 'user_gender'])
        .then(function (response) {
          if (response.status == 'connected') {
            recurrentUser();
          } else {
            apiService.handleInvalidLogin();
          }
        }, function(error) {  
            apiService.handleInvalidLogin();
        });
    }

  }
})();
