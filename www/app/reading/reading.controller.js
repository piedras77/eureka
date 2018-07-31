(function () {
  'use strict';

  angular
  .module('app.reading')
  .controller('ReadingController', ReadingController);

  function ReadingController(TEXT,
                             textService,
                             pronunciationService,
                             sessionService,
                             $ionicPopup,
                             $ionicSlideBoxDelegate,
                             $state,
                             $scope) {
    var _this = this;
    var myAnswers = [];
    var user = sessionService.getCurrentUser();
    var completeSentences = [];
    _this.micType = 'microphone-idle.png';
    _this.texts = TEXT;
    $scope.speaking = false;
    var recognition = new SpeechRecognition();
    // var recognition = new webkitSpeechRecognition();
    recognition.onerror = speakEnd;
    _this.speak = speak;
    _this.goToMain = goToMain;
    _this.changeText = changeText;
    _this.listenAudio = listenAudio;
    activate();

    function activate() {
      $scope.result = [[]];
      $scope.sentences = [[]];
      recognition.lang = 'en-US';
      var XMLparser = new DOMParser().parseFromString(textService.getText(), "text/xml").childNodes[0];
      var sentences = XMLparser.childNodes;
      for (var sentence = 0; sentence < sentences.length; sentence++) {
        var subject = sentences[sentence].getElementsByTagName('complete-subject')[0],
            predicate = sentences[sentence].getElementsByTagName('predicate')[0].textContent;
        subject = subject.id == 'implicit' || subject.id == 'inPredicate' ? '' : subject.textContent + ' ';

        if (XMLparser.id == 6) {
          completeSentences.push(textService.getSentenceJSON(subject + predicate).text + ' ');
        } else {
          completeSentences.push(subject + predicate + ' ');
        }

        splitSentence(sentence);
      }
    }

    function splitSentence(sentenceIndex) {
      var words = completeSentences[sentenceIndex].trim().split(' ');
      var wordCount = 0;
      if (!$scope.sentences[sentenceIndex]) {
        $scope.sentences[sentenceIndex] = [];
      }

      for (var word = 0; word < words.length; word++) {
        $scope.sentences[sentenceIndex][word] = words[word].replace(/[{}]/, '');
      }
    }

    function compareTexts(sentence) {
      var myAnswersLength = myAnswers[sentence].length, sentenceLength = $scope.sentences[sentence].length;
      var largerSentence =  myAnswersLength <= sentenceLength ? myAnswersLength : sentenceLength;
      for (var word = 0; word < largerSentence; word++) {
        var answer =  myAnswers[sentence][word].replace(/[!.,:?]/, '').toLowerCase();
        var sentenceWord = $scope.sentences[sentence][word].replace(/[!.,:?]/g, '').toLowerCase();
        if (!answer || !sentenceWord) {
          break;
        }

        if (!$scope.result[sentence]) {
          $scope.result[sentence] = [];
        }

        var wordWeight = pronunciationService.weightWord(sentenceWord, answer);
        if (wordWeight == 1) {
          $scope.result[sentence][word] = 'word-success';
        } else if (wordWeight > 0.5) {
          $scope.result[sentence][word] = 'word-close';
        } else {
          $scope.result[sentence][word] = 'word-error';
        }
      }

      speakEnd();
    }

    function speak(sentence) {
      $scope.speaking = !$scope.speaking;
      if ($scope.speaking) {
        _this.micType = 'microphone-recording.png';
        recognition.start();
      } else {
        _this.micType = 'microphone-idle.png';
        recognition.stop();
        recognition.abort();
      }

      recognition.onresult = function (event) {
        myAnswers[sentence] = event.results[0][0].transcript.trim().split(' ');
        compareTexts(sentence);
      }
    }

    function speakEnd() {
      $scope.speaking = false;
      _this.micType = 'microphone-idle.png';
      $scope.$apply();
    }

    function changeText() {
      $scope.textsIntro = textService.textsIntro;
      $scope.data = {};
      $ionicPopup.show({
        title: TEXT.TEXTS_AVAILABLE_LIST,
        scope: $scope,
        template: '<label class="item item-select"><select ng-model="data.selectedText" ng-options="option.text for option in textsIntro"></select></label>',
        buttons: [{
          text: TEXT.CANCEL_TEXT,
        },
        {
          text: TEXT.SELECT_TEXT,
          onTap: function () {
            return $scope.data.selectedText;
          }
        }]
      }).then(handleTextChange);
    }

    function handleTextChange(newText) {
      addPoints();
      myAnswers = [];
      if (newText) {
        var newText = sessionService.getMyTexts()[newText.id];
        textService.setText(newText);
        completeSentences = [];
        activate();

        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.update();
      }
    }

    function addPoints() {
      if (myAnswers.length == $scope.sentences.length) {
        sessionService.updatePoints();
      }
    }

    function listenAudio(sentenceNumber) {
      $scope.listening = true;
      TTS.speak({
        text: completeSentences[sentenceNumber],
        locale: 'en-US',
        rate: 0.9,
      }, speechDone, speechDone);
    }

    function speechDone() {
       $scope.listening = false;
       $scope.$apply();
    }

    function goToMain() {
      addPoints();
      $state.go('main');
    }

    function goToResuls() {
      $state.go('results');
    }
  }

})();
