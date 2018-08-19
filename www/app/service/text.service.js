(function () {
  'use strict'

  angular
  .module('app')
  .service('textService', textService);

  function textService(sessionService) {
    var service = {
      getIntroWords: getIntroWords,
      setMyAnswers: setAnswers,
      getMyAnswers: getAnswers,
      myAnswers: [],
      setCorrect: setCorrect,
      getCorrect: getCorrect,
      correct: [],
      getTextIntro: getTextIntro,
      setTextIntro: setTextIntro,
      textsIntro: [],
      getSessionTime: getSessionTime,
      setSessionTime: setSessionTime,
      setExcerciseType: setExcerciseType,
      getExcerciseType: getExcerciseType,
      setText: setText,
      getText: getText,
      getSentenceJSON: getSentenceJSON,
      capitalize: capitalize,
      mapValues: mapValues,
      FROM_MAIN: 0, 
      FROM_TEXTS: 1,
      FROM_DATABASE: 2
    };

    return service;

    function setAnswers(answers) {
      service.myAnswers = answers;
    }

    function getAnswers() {
      return service.myAnswers;
    }

    function setCorrect(correct) {
      service.correct = correct;
    }

    function getCorrect() {
      return service.correct;
    }

    function setText(text) {
      service.myText = text;
    }

    function getText() {
      return service.myText;
    }

    function setTextIntro(textIntro) {
      service.textIntro = textIntro;
    }

    function getTextIntro() {
      return service.textIntro;
    }

    function getSessionTime() {
      return service.sessionTime;
    }

    function setSessionTime(time) {
      service.sessionTime = time;
    }

    function getExcerciseType() {
      return service.excerciseType;
    }

    function setExcerciseType(type) {
      service.excerciseType = type;
    }

    function mapValues(object) {
      return Object.keys(object).map(function(values) {
        return object[values]
      });
    }

    function getIntroWords(introSize, incomingView, texts) {
      var savedTexts = texts;
      switch (incomingView) {
        case service.FROM_MAIN:
          savedTexts = sessionService.getMyTexts()
        break;
        case service.FROM_TEXTS:
          savedTexts = JSON.parse(localStorage.getItem('myTexts'));
          var textArray = [];
          for (var key = 0; key < Object.keys(savedTexts).length; key++) {
            for (var text = 0; text < savedTexts[Object.keys(savedTexts)[key]].length; text++) {
              textArray.push(savedTexts[Object.keys(savedTexts)[key]][text]);
            }
          }

          savedTexts = textArray;
        break;
        case service.FROM_DATABASE:
          var textArray = [];
          for (var text in savedTexts) {
            textArray.push( savedTexts[text].text );
          }

          savedTexts = textArray;
          break;
      }

      var introStrings = [];
      for (var text in savedTexts) {
            var XMLText = new DOMParser().parseFromString(savedTexts[text], "text/xml").childNodes[0];
        var sentences = XMLText.childNodes;
        var textString = '';
        for (var sentence in sentences) {
          if (sentence == 'length') {
            break;
          }

          var subject = sentences[sentence].getElementsByTagName('complete-subject')[0],
              predicate = sentences[sentence].getElementsByTagName('predicate')[0].textContent;
          subject = subject.id != 'implicit' && subject.id != 'inPredicate' ? subject.textContent : '';

          if (XMLText.id == 6) {
            textString += getSentenceJSON(subject + ' ' + predicate).text + ' ';
          } else {
            textString += subject + ' ' + predicate + ' ';
          }

          if (textString.length  > introSize) {
            textString = textString.substring(0, introSize);
            break;
          }
        };

        textString = textString.replace(/[{,}]/g, '');
        introStrings[text] = {text: textString + '...', id: text};
      }

      service.textsIntro = introStrings;
      return introStrings;
    }

    function getSentenceJSON(sentence) {
      var sentenceText = '{';
      var cleanText = '';
      sentence = sentence.split(' ');
      for (var word = 0; word < sentence.length; word++) {
        var wordObject = sentence[word];
        if (wordObject.includes('{')) {
          wordObject = wordObject.replace('{', '');
          while (!sentence[word].includes('}')) {
            wordObject += ' ' + sentence[++word].replace('}', '');
          }
        }

        wordObject = wordObject.split('^');
        sentenceText += '"' + wordObject[0] + '":"' + wordObject[1].split(',') + '", ';
        cleanText += wordObject[0] + ' ';
      }

      sentenceText = sentenceText.substring(0, sentenceText.length - 2) + '}';
      return {wordObjects: JSON.parse(sentenceText), text: cleanText.trim()};
    }

    function capitalize(string) {
      return string.replace(string.charAt(0), string.charAt(0).toUpperCase());
    }
  }
})();
