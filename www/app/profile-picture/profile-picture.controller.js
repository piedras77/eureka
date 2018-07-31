(function () {
  'use strict';

  angular
  .module('app.profile-picture')
  .controller('ProfilePictureController', ProfilePictureController);

  function ProfilePictureController(  $state,
                                      $ionicPopup,
                                      sessionService,
                                      TEXT,
                                      CORE
                                    ) {
    var _this = this;
    var user = sessionService.getCurrentUser();
    _this.texts = TEXT;
    _this.goToProgress = goToProgress;
    _this.changeProfileConfirmation = changeProfileConfirmation;
    setImageRows();

    function goToProgress() {
      $state.go('progress');
    }

    function changeProfileConfirmation(row, column) {
      $ionicPopup.confirm({
        title: TEXT.PROFILE_PICTURE_MESSAGE,
        okType: 'dark',
        cancelText: TEXT.NEGATION_TEXT,
        okText: TEXT.CONFIRMATION_TEXT,
      }).then(function (confirmation) {
        changeProfile(confirmation, _this.imageNames[row][column]);
      });
    }

    function changeProfile(confirmation, image) {
      if (confirmation) {
        user.picture = 'img/profile/' + image + '.png';
        sessionService.setCurrentUser(user);
        goToProgress();
      }
    }

    function setImageRows() {
      var allImages = CORE.PROFILE_PICTURE;
      var imageQuantity = allImages.length;
      _this.imageNames = [];
      while(imageQuantity > 0) {
        _this.imageNames.unshift([allImages[--imageQuantity], allImages[--imageQuantity], allImages[--imageQuantity]]);
      }
    }
 }
})();
