(function () {
  'use strict';

  angular
    .module('app')
    .service('sessionService', sessionService);

  /* @ngInject */
  function sessionService(pronunciationService) {
    var service = {
      setCurrentUser: setCurrentUser,
      getCurrentUser: getCurrentUser,
      setWordTypes: setWordTypes,
      getWordTypes: getWordTypes,
      setMyTexts: setMyTexts,
      getMyTexts: getMyTexts,
      updateStudyingTime: updateStudyingTime,
      getStudyingTime: getStudyingTime,
      setPronunciationWeights: setPronunciationWeights,
      getPronunciationWeights: getPronunciationWeights,
      updatePoints: updatePoints,
    };

    return service;

    function setCurrentUser(user) {
      localStorage.setItem('userSession', JSON.stringify(user));
    }

    function getCurrentUser() {
      return JSON.parse(localStorage.getItem('userSession'));
    }

    function updateStudyingTime(newTime) {
      var time = localStorage.getItem('studyTime');
      time = time ? parseInt(time) : 0;
      localStorage.setItem('studyTime', time + newTime);
    }

    function getStudyingTime() {
      var time = localStorage.getItem('studyTime');
      return time ? time : 0;
    }

    function getWordTypes() {
      return localStorage.getItem('wordTypes');
    }

    function setWordTypes(newWords) {
      localStorage.setItem('wordTypes', JSON.stringify(newWords));
    }

    function setMyTexts(newTexts) {
      localStorage.setItem('myTexts', JSON.stringify(newTexts));
    }

    function getMyTexts() {
      var localTexts = JSON.parse(localStorage.getItem('myTexts'));
      var validTexts = [];
      var XMLText = new DOMParser();
      for (var textLevel in Object.keys(localTexts)) {
        if (textLevel < getCurrentUser().level) {
          var levelTexts =  localTexts[parseInt(textLevel) + 1];
          for (var text = 0; text < levelTexts.length; text++) {
            validTexts.push(levelTexts[text]);
          }
        }
      }

      return validTexts;
    }

    function updatePoints() {
      var user = getCurrentUser();
      var oldLevel = user.level;
      user.level = pronunciationService.pronunciationReady() ? Math.ceil(3.24 * Math.sqrt(++user.points) / 10) : oldLevel;
      user.points = user.points + 1;
      setCurrentUser(user);
      return oldLevel != user.level  ? true : false;
    }

    function setPronunciationWeights(newWeights) {
      localStorage.setItem('pronunciationWeights', JSON.stringify(newWeights));
    }

    function getPronunciationWeights() {
      return JSON.parse(localStorage.getItem('pronunciationWeights'));
    }
  }

})();
