(function () {
  'use strict';

  angular
    .module('app')
    .service('pronunciationService', pronunciationService);

  /* @ngInject */
  function pronunciationService(CORE) {
    var service = {
      updateGlobalWeight: updateGlobalWeight,
      getGlobalWeights: getGlobalWeights,
      replay: false,
      getReplayStatus: getReplayStatus,
      setReplayStatus: setReplayStatus,
      getPronunciationWords: getPronunciationWords,
      setPronunciationWords: setPronunciationWords,
      pronunciationReady: pronunciationReady,
      findHomophone: findHomophone,
      weightWord: weightWord,
    };

    return service;

    function updateGlobalWeight(answer, word) {
      var weightsJSON = JSON.parse(localStorage.getItem('pronunciationWeights'));
      var wordWeight = weightWord(answer, word);
      if (!weightsJSON) {
        weightsJSON = {};
        weightsJSON[answer] = {answers: 1, value: wordWeight};
      } else if (!weightsJSON[word]){
        weightsJSON[answer] = {answers: 1, value: wordWeight};
      } else {
        weightsJSON[answer] = {answers: ++weightsJSON[answer].answers, value: weightsJSON[answer].value + wordWeight};
      }

      localStorage.setItem('pronunciationWeights', JSON.stringify(weightsJSON));
      return wordWeight;
    }

    function getGlobalWeights() {
      return JSON.parse(localStorage.getItem('pronunciationWeights'));
    }

    function findHomophone(results, wordOptions) {
      for (var option in wordOptions) {
        for (var result in results) {
          if (results[result][0].transcript.toLowerCase() == wordOptions[option].word.replace(':', '').toLowerCase()) {
            return wordOptions[option];
          }
        }
      }
    }

    function weightWord(answer, word) {
      if (word == answer) {
        return 1;
      } else {
        var equalLetters = 0;
        for (var letter = 0; letter < answer.length; letter++) {
          if (word.charAt(letter) == answer.charAt(letter)) {
            equalLetters++;
          }
        }

      return equalLetters / answer.length;
      }
    }

    function pronunciationReady() {
      var level = JSON.parse(localStorage.getItem('userSession')).level;
      if (level < 1)
        level = 1;
      else if ( level > 6 )
        level = 6;

      var vocabLength =  CORE.VOCABULARY_EN[level].length;
      var allValues = getGlobalWeights();
      if (!allValues || Object.keys(allValues).length < vocabLength) {
        return false;
      }

      var total = 0;
      var totalDenominator = 0;
      for (var word in allValues) {
        total += allValues[word].value;
        totalDenominator += allValues[word].answers;
      }

      return total / totalDenominator >= 0.6 ? true :  false;
    }

    function getReplayStatus() {
      return service.replay;
    }

    function setReplayStatus(status) {
      service.replay = status;
    }

    function getPronunciationWords () {
      return service.pronunciationWords;
    }

    function setPronunciationWords(vocabulary, translations) {
      service.pronunciationWords = [vocabulary, translations];
    }
  }

})();
