(function () {
  'use strict';

  angular
    .module('app.fill-text')
    .controller('FillController', FillController);

  function FillController($state,
                          $scope,
                          $ionicPopup,
                          $timeout,
                          TEXT,
                          optionsGenerator,
                          pronunciationService,
                          sessionService,
                          textService) {
    var _this = this;
    var text = textService.getText();
    var sessionTime = 0;
    var timer;
    var user = sessionService.getCurrentUser();
    var currentSentence;
    _this.wordOptions = [];
    _this.inputType;
    var recognition = new SpeechRecognition();
    _this.texts = TEXT;
    // var recognition = new webkitSpeechRecognition();
    recognition.onresult = speechResult;
    recognition.onerror = speakEnd;
    $scope.selectedOption = {};
    _this.goToMain = goToMain;
    _this.optionClick = optionClick;
    _this.buttonType = buttonType;
    _this.verifyCompleteAnswers = verifyCompleteAnswers;
    _this.speak = speak;
    _this.listenAudio = listenAudio;

    activate();

    function activate() {
      recognition.lang = 'en-US';
      _this.micType = "microphone-idle.png";
      $ionicPopup.show({
        title: TEXT.OPTION_TITLE,
        buttons: [
          { text: TEXT.FILL_IN_OPTION_SELECT,
            type: 'button-positive button-outline',
            onTap: function(e) {
              _this.inputType = false;
            } },
          { text: '<b>' + TEXT.FILL_IN_OPTION_SPELL + '</b>',
            type: 'button-positive',
            onTap: function(e) {
              _this.inputType = true;
            }
          }
        ]
      }).then(setSentences);
    }

    function listenAudio(word) {
      TTS.speak({
        text: word,
        locale: 'en-US',
        rate: 0.9,
      }, speechDone, speechDone);
    }

    function speechDone(successs) {
      $scope.vocabularyColor = null;
      $scope.$apply();
    }

    function setSentences() {
      _this.sentences = optionsGenerator.getSentences(user.level, text);
      _this.wordOptions = optionsGenerator.getOptions();
      addTime();
    }

    function speak(sentence) {
      $scope.unknownAnswer = '';
      currentSentence = sentence;
      $scope.speaking = !$scope.speaking;
      if ($scope.speaking) {
        _this.micType = "microphone-recording.png";
        recognition.start();
      } else {
        recognition.stop();
        recognition.abort();
      }
    }

    function speechResult(event) {
      if (event.results.length > 0) {
        var result = pronunciationService.findHomophone(event.results, _this.wordOptions[currentSentence]);
        if (result) {
          $scope.selectedOption[currentSentence] = result;
        } else {
          $scope.unknownAnswer = 'Entendí "' + event.results[0][0].transcript + '"';
        }
      }

      // pronunciationService.updateGlobalWeight(_this.vocabulary[_this.wordNumber], $scope.speechResult);
      speakEnd();
    }

    function speakEnd() {
      $scope.speaking = false;
      _this.micType = 'microphone-idle.png';
      $scope.$apply();
    }

    function verifyCompleteAnswers() {
      if (_this.sentences.length != textService.mapValues($scope.selectedOption).length) {
        $ionicPopup.alert({
          title: TEXT.INCOMPLETE_TITLE,
          template: TEXT.INCOMPLETE_MESSAGE,
          cssClass: 'align-text: center',
        });
      } else {
        textService.setMyAnswers(textService.mapValues($scope.selectedOption));
        textService.setCorrect(_this.sentences);
        textService.setSessionTime(sessionTime);
        textService.setExcerciseType('fill-text');
        $timeout.cancel(timer);
        $state.go('results');
      }
    }

    function optionClick(sentence, option) {
      $scope.selectedOption[sentence] = _this.wordOptions[sentence][option];
    }

    function buttonType(sentence, buttonNumber) {
      if ($scope.selectedOption[sentence] == _this.wordOptions[sentence][buttonNumber]) {
        return null;
      } else {
        return 'button-outline';
      }
    }

    function goToMain() {
      $state.go('main');
    }

    function addTime() {
      sessionTime += 1000;
      timer = $timeout(addTime, 1000);
    }
  }

})();
