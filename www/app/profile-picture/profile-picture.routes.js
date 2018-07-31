(function () {
  'use strict';

  angular
    .module('app.profile-picture')
    .config(progressRoutes);

  function progressRoutes($stateProvider) {
    $stateProvider
      .state('profile-picture', {
        url: '/profile-picture',
        templateUrl: 'app/profile-picture/profile-picture.html',
        controller: 'ProfilePictureController',
        controllerAs: 'vm',
        cache: false,
      });
  }
})();
