(function () {
  'use strict';

  angular
  .module('app.results')
  .controller('ResultsController', ResultsController);

  function ResultsController($state,
                             $scope,
                             CORE,
                             TEXT,
                             sessionService,
                             pronunciationService,
                             textService) {
    var _this = this;
    var RESULTS = {WRONG: 0, INCONTEXTUAL: 1, INCORRECT_CATEGORY: 2, INCORRECT_SUBCATEGORY: 3, CORRECT: 4};
    var graphColors = ["#387ef5", 'red'];
    _this.texts = TEXT;
    _this.explanationsSlide = false;
    _this.results = [];
    _this.errors = [];
    _this.wrongSentences = [];
    _this.explanationNumber = -1;
    _this.explanationJoiner = ['On the other hand', 'En cambio'];
    _this.sessionTime = prepareTime();
    _this.correct = textService.getCorrect();
    $scope.myAnswers = textService.getMyAnswers();
    _this.goToMain = goToMain;
    _this.replayPronunciation = replayPronunciation;
    _this.newPronunciationWords = newPronunciationWords;
    _this.hideNewLevelNotification = hideNewLevelNotification;
    _this.changeLanguage = changeLanguage;
    _this.changeSlide = changeSlide;
    activate();

    function activate() {
      _this.newLevelMessage = sessionService.updatePoints();
      _this.user = sessionService.getCurrentUser();
      _this.resultType = textService.getExcerciseType();
      _this.explanations = CORE.EXPLANATIONS;
      _this.imageUrl = _this.user.level < 6 ? 'img/english-flag.png' : 'img/spain-flag.png';
      _this.language = _this.user.level < 6 ? CORE.LANGUAGE.SPANISH : CORE.LANGUAGE.ENGLISH;
      var resultLabels = [TEXT.CORRECT_ANSWERS_TEXT, TEXT.INCORRECT_ANSWERS_TEXT];
      //todo update points DT
      switch (_this.resultType) {
        case 'fill-text':
          getFillTextResults();
          prepareGraph('results', 'doughnut', resultLabels, graphColors, null);
        break;
        case 'pronunciation':
          prepareGraph('results', 'pie', getPronunciationResults(), ['#007FFF', '#66B2FE', '#B1D8FF'], null);
        break;
        case 'classify':
          getClassifyResults();
          prepareGraph('results', 'bar', resultLabels, graphColors, 'Classify');
      }
    }

    function prepareGraph(canvasId, graphType, labels, colors, title) {
      var resultsContext = document.getElementById(canvasId).getContext('2d');
      var resultsCanvas = new Chart(resultsContext, {
        type: graphType,
        data: {
          labels: labels,
          datasets: [{
            label: title,
            backgroundColor: colors,
            data: _this.data,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 2,
            pointHitRadius: 10,
          }]
        }
      });
    }

    function getClassifyResults() {
      var wrongAnswers = 0;
      for (var currentAnswer = 0; currentAnswer < _this.correct.length; currentAnswer++) {
        var correctCode = _this.correct[currentAnswer].answer.code;
        var incorrectCode = $scope.myAnswers[currentAnswer].code;
        if(correctCode != incorrectCode) {
          if (!CORE.EXPLANATIONS[correctCode] || !CORE.CODES_MEANING[correctCode]) {
            _this.correct[currentAnswer].answer.code = 'UAE';
          }

          if (!CORE.EXPLANATIONS[incorrectCode] || !CORE.CODES_MEANING[incorrectCode]) {
            $scope.myAnswers[currentAnswer].code = 'UAE';
          }

          //TODO: STANDARIZE, USER EITHER WORD OR QUESTION WORD
          _this.correct[currentAnswer].word = _this.correct[currentAnswer].answer.questionWord;
          var errorObject = getErrorObject(_this.correct[currentAnswer].answer, $scope.myAnswers[currentAnswer]);
          ++wrongAnswers;
          _this.wrongSentences.push(_this.correct[currentAnswer].completeSentence);
          _this.errors.push(errorObject);
        }
      }

      _this.data = [Object.keys($scope.myAnswers).length - wrongAnswers, wrongAnswers, 0];
    }

    function getPronunciationResults() {
      var weights = pronunciationService.getGlobalWeights();
      var gameWords = pronunciationService.getPronunciationWords()[0];
      var perfect = '', intermediate = '', wrong = '';
      _this.data = [0, 0, 0];

      for (var word = 0; word < gameWords.length; word++) {
        var average = weights[gameWords[word]].value / weights[gameWords[word]].answers;
        if (average > 0.9) {
          perfect += gameWords[word] + ', ';
          ++_this.data[0];
        } else if (average > 0.5) {
          intermediate += gameWords[word] + ', ';
          ++_this.data[1];
        } else {
          wrong += gameWords[word] + ', ';
          ++_this.data[2];
        }
      }

      if (perfect.length > 40) {
        perfect = perfect.substring(0, 40) + '...';
      }

      if (intermediate.length > 40) {
        intermediate = intermediate.substring(0, 40) + '...';
      }

      if (wrong.length > 40) {
        wrong = wrong.substring(0, 40) + '...';
      }

      if (_this.newLevelMessage) {
        localStorage.removeItem('pronunciationWeights');
      }

      return [perfect, intermediate, wrong];
    }

    function getFillTextResults() {
      var correct = 0;

      for (var sentence = 0; sentence < _this.correct.length; sentence++) {
        var correctCode = _this.correct[sentence].answer.code;
        if (_this.correct[sentence].answer.word.replace(/[!?.,]/, '') == $scope.myAnswers[sentence].word
          && correctCode == $scope.myAnswers[sentence].code) {
            correct++;
            _this.results[sentence] = RESULTS.CORRECT;
        } else {
          var incorrectCode = $scope.myAnswers[sentence].code;
          _this.correct[sentence].completeSentence = _this.correct[sentence].completeSentence.join(' ');
          if (!CORE.EXPLANATIONS[correctCode] || !CORE.CODES_MEANING[correctCode]) {
            _this.correct[sentence].answer.code = 'UAE';
          }

          if (!CORE.EXPLANATIONS[incorrectCode] || !CORE.CODES_MEANING[incorrectCode]) {
            $scope.myAnswers[sentence].code = 'UAE';
          }

          var errorObject = getErrorObject(_this.correct[sentence].answer, $scope.myAnswers[sentence]);
          //TODO: add errorStyle() to view;
          _this.wrongSentences.push(_this.correct[sentence].completeSentence);
          _this.errors.push(errorObject);
        }
      }

      _this.data  = [correct, _this.correct.length - correct];
    }

    function getErrorObject(correct, incorrect) {
      return {
        correctCode: CORE.CODES_MEANING[correct.code],
        incorrectCode: CORE.CODES_MEANING[incorrect.code],
        correctWord: correct.word,
        incorrectWord: incorrect.word,
        correctExplanation: CORE.EXPLANATIONS[correct.code],
        incorrectExplanation: CORE.EXPLANATIONS[incorrect.code],
      };
    }

    function getErrorStyle(correctCode, incorrectCode) {
      if (correctCode == incorrectCode) {
        _this.results[index] = RESULTS.INCONTEXTUAL;
      } else if (correctCode.charAt(0) == incorrectCode.charAt(0)) {
        _this.results[index] = RESULTS.INCORRECT_SUBCATEGORY;
      } else {
        _this.results[index] = RESULTS.INCORRECT_CATEGORY;
      }
      // else {
    //   _this.results[index] = RESULTS.WRONG;
    // }
    }

    function prepareTime() {
      var sessionTime = textService.getSessionTime() / 1000;
      sessionService.updateStudyingTime(sessionTime);
      if (sessionTime < 60) {
        return sessionTime + ' seconds.';
      } else if (sessionTime == 60) {
        return '1 minut';
      } else if (sessionTime % 60 == 0) {
        return sessionTime / 60 + ' minutes.'
      } else {
        return Math.round(sessionTime / 60) + ' minutes and ' + sessionTime % 60 + '.';
      }
    }

    function changeLanguage() {
      _this.imageUrl = _this.imageUrl == 'img/english-flag.png' ? 'img/spain-flag.png' : 'img/english-flag.png';
      _this.language = _this.language == CORE.LANGUAGE.SPANISH ? CORE.LANGUAGE.ENGLISH : CORE.LANGUAGE.SPANISH;
    }

    function hideNewLevelNotification() {
      _this.newLevelMessage = false;
    }

    function changeSlide(menuButton) {
      if (menuButton) {
        $state.go('main');
      } else if (++_this.explanationNumber < _this.errors.length) {
        _this.explanationsSlide = true;
      } else {
        _this.explanationNumber = -1;
        _this.explanationsSlide = false;
      }
    }

    function goToMain() {
      $state.go('main');
    }

    function replayPronunciation() {
      pronunciationService.setReplayStatus(true);
      $state.go('pronunciation');
    }

    function newPronunciationWords() {
      pronunciationService.setReplayStatus(false);
      $state.go('pronunciation');
    }

  }
})();
