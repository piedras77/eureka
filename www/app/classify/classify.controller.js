(function () {
  'use strict';

  angular
    .module('app.fill-text')
    .controller('ClassifyController', ClassifyController);

  function ClassifyController($state,
                              $ionicPopup,
                              $timeout,
                              TEXT,
                              sessionService,
                              classifyService,
                              textService) {
    var _this = this;
    var correctOption = 0;
    var options = [];
    var user = sessionService.getCurrentUser();
    var excerciseTime = 0;
    _this.texts = TEXT;
    _this.goToMain = goToMain;
    _this.sentences = [];
    _this.dividedSentences = [];
    _this.optionClick = optionClick;
    _this.buttonType = buttonType;
    _this.selections = {};
    _this.question = [];
    _this.verifyCompleteAnswers = verifyCompleteAnswers;
    activate();

    function activate() {
      var XMLText = new DOMParser().parseFromString(textService.getText(), "text/xml").childNodes[0];
      var sentences = XMLText.childNodes;
      var advancedText = XMLText.id == 6 ? true : false;
      _this.sentences = classifyService.getQuestions(user.level, sentences, advancedText);
      _this.questionOptions = classifyService.getOptions();
      $timeout(addTime, 1000);
    }

    function goToMain() {
      $state.go('main');
    }

    function verifyCompleteAnswers() {
      if (_this.sentences.length != Object.keys(_this.selections).length) {
        $ionicPopup.alert({
          title: TEXT.INCOMPLETE_TITLE,
          template: TEXT.INCOMPLETE_MESSAGE,
          cssClass: 'align-text: center',
        });
      } else {
        $timeout.cancel();
        textService.setMyAnswers(_this.selections);
        textService.setCorrect(_this.sentences);
        textService.setSessionTime(excerciseTime);
        textService.setExcerciseType('classify');
        $state.go('results');
      }
    }

    function optionClick(sentence, option) {
      _this.selections[sentence] = _this.questionOptions[sentence][option];
    }

    function buttonType(sentence, buttonNumber) {
      if (_this.selections[sentence] == _this.questionOptions[sentence][buttonNumber]) {
        return null;
      } else {
        return 'button-outline';
      }
    }

    function addTime() {
      excerciseTime += 1000;
      $timeout(addTime, 1000);
    }
  }
})();
