(function () {
  'use strict';

  angular
    .module('app.pronunciation')
    .controller('PronunciationController', PronunciationController);

  function PronunciationController($scope,
                                   CORE,
                                   TEXT,
                                   sessionService,
                                   $timeout,
                                   pronunciationService,
                                   textService,
                                   $state) {
    var _this = this;
    var level = sessionService.getCurrentUser().level;
    var sessionTime = 0;
    var timer;
    _this.texts = TEXT;
    _this.vocabulary = [];
    _this.translation = [];
    _this.answerType = 'answer-neutral';
    _this.wordNumber = 0;
    $scope.vocabularyState = 'not-reading';
    $scope.speaking = false;
    $scope.speechResult = TEXT.PRONUNCIATION_INSTRUCTIONS;
    // var recognition = new SpeechRecognition();
    var recognition = new webkitSpeechRecognition();
    recognition.onresult = speechResult;
    recognition.onerror = speakEnd;
    _this.speak = speak;
    _this.goToMain = goToMain;
    _this.verifyAnswer = verifyAnswer;
    _this.nextSlide = nextSlide;
    _this.previousSlide = previousSlide;
    _this.listenAudio = listenAudio;

    activate();

    function activate() {
      recognition.lang = 'en-US';
      _this.micType = "microphone-idle.png";
      if (pronunciationService.getReplayStatus()) {
        var pronunciationWords = pronunciationService.getPronunciationWords();
        _this.vocabulary = pronunciationWords[0];
        _this.translation = pronunciationWords[1];
      } else {
        getRandomWords();
      }

      addTime();
    }

    function listenAudio() {
      $scope.vocabularyState = 'reading';
      TTS.speak({
        text: _this.vocabulary[_this.wordNumber],
        locale: 'en-US',
        rate: 0.9,
      }, speechDone, speechDone);
    }

    function speechDone(successs) {
      $scope.vocabularyState = 'not-reading';
      $scope.$apply();
    }

    function speak() {
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
        var result = pronunciationService.findHomophone(event.results, [{word: _this.vocabulary[_this.wordNumber]}]);
        if (result) {
          result = result.word;
        } else {
          result = event.results[0][0].transcript;
        }

        $scope.speechResult = result.replace(result.charAt(0), result.charAt(0).toUpperCase());
      }

      _this.answerType = !verifyAnswer() ? 'answer-correct' : 'answer-incorrect';
      pronunciationService.updateGlobalWeight(_this.vocabulary[_this.wordNumber], $scope.speechResult);
      speakEnd();
    }

    function speakEnd() {
      $scope.speaking = false;
      _this.micType = 'microphone-idle.png';
      $scope.$apply();
    }

    function getRandomWords() {
      var wordNums = [];
      var allVocabulary = CORE.VOCABULARY_EN[level];
      var allTranslations = CORE.VOCABULARYT_EN_SP[level];
      var randomNumber, word, translation, vocabSentence = '';
      for (var num  = 0; num < 7; num++) {
        do {
          randomNumber = Math.round((allVocabulary.length - 1) * Math.random());
          word = allVocabulary[randomNumber];
          translation = allTranslations[randomNumber];
        } while (vocabSentence.includes(word));

        vocabSentence += word + ' ';
        _this.vocabulary[num] = word.replace(word.charAt(0), word.charAt(0).toUpperCase());
        _this.translation[num] = translation.replace(translation.charAt(0), translation.charAt(0).toUpperCase());
      }

      pronunciationService.setPronunciationWords(_this.vocabulary, _this.translation);
    }

    function nextSlide() {
      $scope.speechResult = TEXT.PRONUNCIATION_INSTRUCTIONS;
      _this.answerType = 'answer-neutral';
      if (++_this.wordNumber == 7) {
        $timeout.cancel(timer);
        textService.setSessionTime(sessionTime);
        textService.setExcerciseType('pronunciation');
        $state.go('results');
      }
    }

    function previousSlide() {
      $scope.speechResult = TEXT.PRONUNCIATION_INSTRUCTIONS;
      _this.answerType = 'answer-neutral';
      if (_this.wordNumber > 0) {
        _this.wordNumber--;
      }
    }

    function verifyAnswer() {
      if ($scope.speechResult.trim() == _this.vocabulary[_this.wordNumber].trim()) {
        return false;
      }

      return true;
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
