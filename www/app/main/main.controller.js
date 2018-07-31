(function () {
  'use strict';

  angular
    .module('app.main')
    .controller('MainController', MainController);

  function MainController($state,
                          $scope,
                          $ionicPopup,
                          $cordovaSocialSharing,
                          $cordovaFacebook,
                          CORE,
                          TEXT,
                          textService,
                          pronunciationService,
                          sessionService) {
    var _this = this;
    _this.categories = TEXT;
    _this.pronunciationReady = pronunciationService.pronunciationReady();
    _this.knowsTextOptions = localStorage.getItem('knowsTextOptions');
    _this.textsIntro = textService.getIntroWords(25, false);
    _this.previousText = textService.getTextIntro() ? textService.getTextIntro() : _this.textsIntro[0];
    _this.selectedText = _this.previousText;
    _this.user = sessionService.getCurrentUser();
    _this.logOut = logOut;
    _this.myTexts = myTexts;
    _this.myProgress = myProgress;
    _this.socialShare = socialShare;
    _this.changeView = changeView;
    _this.showAvailableTexts = showAvailableTexts;
    _this.aboutTheApp = aboutTheApp;
    if (_this.user.level > 6) {
      _this.user.level = 6;
      sessionService.setCurrentUser(_this.user);
    }
    socialShare();

    function changeView(exerciseType) {
      if (true) {
      // if (_this.pronunciationReady || exerciseType == 'pronunciation') {
        var allTexts = sessionService.getMyTexts();
        textService.setText(allTexts[_this.selectedText.id]);
        textService.setTextIntro({id: _this.selectedText.id, text: _this.selectedText.text});
        switch (exerciseType) {
          case 'fill-text':
            $state.go('fill-text');
            break;
          case 'classify':
            $state.go('classify');
            break;
          case 'reading':
            $state.go('reading');
            break;
          case 'pronunciation':
            $state.go('pronunciation');
            break;
        }
      } else {
        $ionicPopup.alert({
          title: TEXT.LOCKED_CATEGORY_TITLE,
          template: TEXT.LOCKED_CATEGORY_MESSAGE,
          okText: 'Aceptar',
        });
      }
    }

    function socialShare() {
      var randomShare = Math.round(Math.random() * 50);
      if (randomShare == 7 && localStorage.getItem('shareMessage')) {
        $ionicPopup.show({
          title: TEXT.SHARE_PROMPT,
          cssClass: 'share-popup',
          buttons: [
            {
              text: TEXT.CONFIRMATION_TEXT,
              onTap: shareEureka,
              type: 'positive'
            },
            {
              text: TEXT.DELAY_TEXT,
            },
            {
              text: TEXT.NEGATION_TEXT,
              onTap: localStorage.setItem('shareMessage', false)
            }],
        });
      }
    }

    function showAvailableTexts() {
      localStorage.setItem('knowsTextOptions', true);
      $ionicPopup.alert({
        title: TEXT.TEXTS_AVAILABLE_LIST,
        scope: $scope,
        cssClass: "radio-input",
        template: '<div class="list"><label class="item" ng-repeat="text in vm.textsIntro"><input class="input" ng-model="vm.selectedText" ng-value="text" type="radio">{{text.text}}</label></div>'
      });
    }

    function shareEureka() {
      var shareURL = ionic.Platform.isIOS() ? 'https://www.google.com/#q=eureka+ios' : 'https://www.google.com/#q=eureka+android';
      $cordovaSocialSharing.share(TEXT.SHARE_MESSAGE, TEXT.SHARE_TITLE, "www/img/logo.png", shareURL);
    }

    function logOut() {
      //TODO: SAVE PRONUNCIATION WEIGHTS ON DB PRIOR TO DELETING
      localStorage.removeItem('userSession');
      localStorage.removeItem('shareMessage');
      $cordovaFacebook.logout('Goodbye!');
      $state.go('home');
    }

    function myTexts() {
      $state.go('texts');
    }

    function myProgress() {
      $state.go('progress');
    }

    function aboutTheApp() {
      $state.go('about-app');
    }
  }
})();
