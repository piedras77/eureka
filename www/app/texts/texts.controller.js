(function () {
  'use strict';

  angular
    .module('app.texts')
    .controller('TextsController', TextsController);

  function TextsController($state,
                           $ionicPopup,
                           $ionicLoading,
                           TEXT,
                           apiService,
                           sessionService,
                           textService) {

    var _this = this;
    var savedTexts = [];
    var newTexts = [];
    var pageNumber = 1;
    _this.TEXT_CONSTANTS = TEXT;
    _this.user = sessionService.getCurrentUser();
    _this.texts = [];
    _this.newPromps = [];
    _this.logOut = apiService.logout;
    _this.deleteText = deleteText;
    _this.downloadText = downloadText;
    _this.mainMenu = mainMenu;
    _this.showFullText = showFullText;
    _this.myProgress = myProgress;
    _this.aboutTheApp = aboutTheApp;
    _this.getNewTexts = getNewTexts;
    activate();

    function activate() {
      var textsByLevel = JSON.parse(localStorage.getItem('myTexts'));

      for (var level = 0; level < Object.keys(textsByLevel).length; level++) {
        for (var text = 0; text < textsByLevel[Object.keys(textsByLevel)[level]].length; text++) {
          savedTexts.push({text: textsByLevel[Object.keys(textsByLevel)[level]][text], level: Object.keys(textsByLevel)[level]});
        }
      }

      _this.texts = textService.getIntroWords(43, textService.FROM_TEXTS, null);
    }

    function deleteText(textNumber) {
      $ionicPopup
        .confirm({
          title: TEXT.DELETE_TEXT_CONFIRMATION_TITLE,
          template: TEXT.DELETE_TEXT_CONFIRMATION_MESSAGE,
          okText: TEXT.OK_BUTTON,
          okType: 'assertive',
          cancelText: 'No',
        })
        .then(function (response) {
          handleDelete(response, textNumber);
        });
    }

    function downloadText(textNumber) {
      $ionicPopup
        .confirm({
          title: TEXT.DOWLOAD_TEXT_TITLE,
          template: TEXT.DOWLOAD_TEXT_MESSAGE,
          okText: TEXT.OK_BUTTON,
          okType: 'positive',
          cancelText: 'No',
        })
        .then(function (response) {
            handleDownload(response, textNumber);
        });
    }

    function showFullText(textNumber, fromDB) {
      var fullTextInfo = cleanTextCodes(
        fromDB ? newTexts[textNumber].text : savedTexts[textNumber].text,
        fromDB ? newTexts[textNumber].level : savedTexts[textNumber].level
      );
      $ionicPopup
        .alert({
          title: 'Level ' + fullTextInfo.level,
          template: fullTextInfo.text,
          cssClass: 'width: 100%;',
        });
    }

    function cleanTextCodes(text, level) {
      var XMLparser = new DOMParser().parseFromString(text, "text/xml").childNodes[0];
      level += _this.user.level < level ? ' (' + TEXT.UNAVAILABLE_TEXT_MESSAGE + ' ' + level + ')' : '';
      var XMLText = XMLparser.childNodes;
      var cleanText = '';
      for (var sentence = 0; sentence < XMLText.length; sentence++) {
        var subject = XMLText[sentence].getElementsByTagName('complete-subject')[0],
            predicate = XMLText[sentence].getElementsByTagName('predicate')[0].textContent;
        subject = subject.id == 'implicit' || subject.id == 'inPredicate' ? '' : subject.textContent + ' ';
        if (XMLparser.id > 5) {
          cleanText += textService.getSentenceJSON((subject + predicate).trim()).text + ' ';
        } else {
          cleanText += subject + predicate + ' ';
        }
      }

      cleanText = cleanText.replace(/[{,}]/g, '');
      return {text: cleanText, level: level};
    }

    function handleDelete(response, textNumber) {
      if (response) {
        var allTexts = JSON.parse(localStorage.getItem('myTexts'));
        var levelTexts = allTexts[savedTexts[textNumber].level];
        for (var text = 0; text < levelTexts.length; text++) {
          if (levelTexts[text].includes(savedTexts[textNumber].text)) {
            levelTexts.splice(text, 1);
          }
        }

        allTexts[savedTexts[textNumber].level] = levelTexts;
        sessionService.setMyTexts(allTexts);
        savedTexts.splice(textNumber, 1);
        _this.texts.splice(textNumber, 1);
      }
    }

    function handleDownload(response, textNumber) {
      if (response) {
        var allTexts = JSON.parse(localStorage.getItem('myTexts'));
        var levelTexts = allTexts[newTexts[textNumber].level];
        levelTexts.push(newTexts[textNumber].text);
        allTexts[newTexts[textNumber].level] = levelTexts;
        sessionService.setMyTexts(allTexts);
        newTexts.splice(textNumber, 1);
        _this.newPromps.splice(textNumber, 1);
        activate();
      }
    }

    function getNewTexts() {
      $ionicLoading.show();
      apiService.getTexts(pageNumber++)
        .then(function(result) {
          $ionicLoading.hide();
          newTexts = newTexts.concat(result);
          _this.newPromps = textService.getIntroWords(43, textService.FROM_DATABASE, newTexts);
        }, function(error) {
            $ionicLoading.hide();
        });
    }

    function myProgress() {
      $state.go('progress');
    }

    function mainMenu() {
      $state.go('main');
    }

    function aboutTheApp() {
      $state.go('about-app');
    }

  }
})();
