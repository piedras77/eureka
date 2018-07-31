(function () {
  'use strict';

  angular
    .module('app')
    .service('optionsGenerator', optionsGenerator);

  function optionsGenerator(CORE, textService) {
    var service = {
      XMLparser: new DOMParser(),
      getSentences: getSentences,
      getAnswers: getAnswers,
      getOptions: getOptions,
      answers: [],
      options: [],
      completeSentence: '',
    };
    var possessiveList = {'mine': 'PPP1', 'yours': 'PPP2', 'his': 'PPP3', 'hers': 'PPP4', 'ours': 'PPP5', 'their': 'PPP6'};
    var toBeCodes = {'am': 'VTB1', 'are': 'VTB2', 'is': 'VTB3', 'will be': 'VTBSF'};
    var toHaveCodes = {'have': 'VTH1', 'has': 'VTH3'};
    var pronounList = {'i': 'PP1', 'me': 'PP1', 'we': 'PP4', 'us': 'PP4', 'you': 'PP2', 'she': 'PP3',
      'her': 'PP3', 'he': 'PP3', 'him': 'PP3', 'they': 'PP6', 'it': 'PP7',
      'that': 'PD2', 'which': 'XZ2', 'who': 'XZ1', 'this': 'PD1', 'these': 'PD3', 'that': 'PRR', 'those': 'PD4', 'anyone': 'PII', 'anything': 'PII'};
    var QUESTION_FUNCTIONS = [verbsToBeToHave, answersPronouns, answersVerbsQuestion,
        answersInterrogative, answersSinceFor, answersAdvanced];
    return service;

    function getAnswers() {
      return service.answers;
    }

    function getOptions() {
      return service.options;
    }

    function getSentences(level, text) {
      service.options = [];
      service.answers =  [];
      var XMLDoc = service.XMLparser.parseFromString(text, "text/xml");
      var sentences =  XMLDoc.documentElement.childNodes;
      var textLevel = XMLDoc.childNodes[0].id;
      var sentenceArray = [], sentenceParts, results, completeSubject;
      for (var sentence = 0; sentence < sentences.length; sentence++) {
        completeSubject = sentences[sentence].getElementsByTagName('complete-subject')[0];
        completeSubject = completeSubject.id == 'implicit' || completeSubject.id == 'inPredicate' ? '' : completeSubject.textContent;
        sentenceParts = {
          part1: completeSubject, part2: sentences[sentence].getElementsByTagName('predicate')[0].textContent
        };
        sentenceParts.completeSentence = (sentenceParts.part1 + ' ' + sentenceParts.part2).toLowerCase();
        if (textLevel == '6') {
          var advancedSentence = textService.getSentenceJSON(sentenceParts.completeSentence);
          sentenceParts.completeSentence = advancedSentence.text;
          sentenceParts.answer = QUESTION_FUNCTIONS[5](advancedSentence.wordObjects);
        } else {
          sentenceParts.answer = setAnswers(level, sentences[sentence]);
        }

        var partsArray = splitSentence(sentenceParts.completeSentence, sentenceParts.answer.word);
        sentenceParts.part1 = textService.capitalize(partsArray.part1);
        sentenceParts.part2 = partsArray.part2;
        sentenceParts.completeSentence = sentenceParts.completeSentence.split(' ');
        if (sentenceParts.part1.length == 0) {
          sentenceParts.answer.word = textService.capitalize(sentenceParts.answer.word);
        }

        sentenceArray.push(sentenceParts);
      };

      return sentenceArray;
    }

    function setAnswers(level, sentence) {
      var questionLevel = getAnswerLevel(sentence, level);
      var results = QUESTION_FUNCTIONS[questionLevel - 1](sentence, level);
      service.answers.push(results.answer);
      return results;
    }

    function splitSentence(completeSentence, answerWord) {
      answerWord = answerWord.toLowerCase();
      completeSentence = '****' + completeSentence.replace(/[{,}.!]/g, '') + '****';
      var word  = ' ' + answerWord + ' ';
      var sentenceParts = completeSentence.split(word);
      if (sentenceParts.length < 2) {
        word = '****' + answerWord + ' ';
        sentenceParts = completeSentence.split(word);
      }

      if (sentenceParts.length < 2) {
        word = ' ' + answerWord + '****';
        sentenceParts = completeSentence.split(word);
      }

      sentenceParts[1] = sentenceParts[1].replace('****', '');
      return {part1: sentenceParts[0].substring(4), part2: sentenceParts[1]};
    }

    function getAnswerLevel(sentence, userLevel) {
      var optionsTag = {'verb-to-be': 1, 'verb-to-have': 1, 'pronoun': 2,
          'verb': 3, 'interrogative': 4};
      var possibleLevels = [];
      var currentTag;
      for (var tag = 0; tag < Object.keys(optionsTag).length; tag++) {
        currentTag = sentence.getElementsByTagName(Object.keys(optionsTag)[tag]);
        if (currentTag.length && currentTag[0].id != 'implicit') {
          possibleLevels.push(optionsTag[currentTag[0].tagName]);
        }
      };

      if (userLevel > 4) {
        var timePeriods = service.completeSentence.includes('since');
        timePeriods = timePeriods ? timePeriods : service.completeSentence.includes('for');
        if (timePeriods) {
          possibleLevels.push(5);
        }
      }

      return possibleLevels[Math.floor(Math.random() * possibleLevels.length)]
    }

    function verbsToBeToHave(sentence) {
      var answer = sentence.getElementsByTagName('verb-to-be')[0];
      answer = answer ? answer : sentence.getElementsByTagName('verb-to-have')[0];
      var answerCode = answer.tagName == 'verb-to-be' ? toBeCodes[answer.textContent] : toHaveCodes[answer.textContent];
      service.options.push(optionsToBeToHave(answer.tagName, answer.textContent));
      return {word: answer.textContent, code: answerCode};
    }

    function optionsToBeToHave(optionType, word) {
      switch(optionType) {
        case 'verb-to-be':
          var options = [{word: 'am', code: 'VTB1'}, {word: 'are', code: 'VTB2'}, {word: 'is', code: 'VTB3'}];
          word == 'will be' ? options.splice(Math.floor(Math.random() * 3), 1 , {word: 'will be', code: 'VTBW'}) : null;
          return options;
        case 'verb-to-have':
            return [{word: 'have', code: 'VTH1'}, {word: 'has', code: 'VTH3'}];
        default:
          return [{word: 'predicate', code: 'PRDC'}, {word: 'complete subject', code: 'CPS'}];
      }
    }

    function answersPronouns(sentence, level) {
      var answer = sentence.getElementsByTagName('pronoun');
      // var possibleOptions = level == 2 ? Object.assign(pronounList) : Object.assign(pronounList, possessiveList);
      var possibleOptions = pronounList;
      var options = [];
      for (var randomPronoun = 0; randomPronoun < 4; randomPronoun++) {
        var randomOption = Math.floor(Math.random() * (Object.keys(possibleOptions).length - 1));
        options.push({word: Object.keys(possibleOptions)[randomOption], code: textService.mapValues(possibleOptions)[randomOption]});
      }

      var answerObject = {word: answer[0].textContent.toLowerCase(), code: answer[0].id};
      answerObject.word = answerObject.word == 'i' ? answerObject.word.toUpperCase() : answerObject.word;
      options.push(answerObject);
      service.options.push(options);
      return answerObject;
    }

    //error here
    function answersInterrogative(sentence) {
      var answer = sentence.getElementsByTagName('interrogative');
      var answerObject = {};
      answerObject.word = answer[0].textContent.toLowerCase();
      answerObject.code = CORE.INTERROGATIVES_CODES[answerObject.word.toLowerCase()];
      var options = optionsInterrogative(answerObject);
      service.options.push(options);
      return answerObject
    }

    function optionsInterrogative(answer) {
      var options = [];

      for (var option = 0; option < Object.keys(CORE.INTERROGATIVES_CODES).length; option++) {
        options.push({word: Object.keys(CORE.INTERROGATIVES_CODES)[option], code: CORE.INTERROGATIVES_CODES[Object.keys(CORE.INTERROGATIVES_CODES)[option]]});
      }

      options = shuffleOptions(options, answer);
      options.splice(Math.floor(Math.random * 4), 0, answer);
      return options;
    }

    function answersSinceFor() {
      var sinceObject = {word: 'since', code: 'VTB1'};
      var forObject = {word: 'for', code: 'VTB3'};
      var answer = service.completeSentence.includes('since') ? sinceObject : forObject;
      var baitAnswer = answer == sinceObject ? forObject : sinceObject;
      var objectOptions = [CORE.INTERROGATIVES_CODES, possessiveList, toBeCodes, toHaveCodes, pronounList];
      var options = [];
      for (var optionType in objectOptions) {
        var currentOptions = objectOptions[optionType];
        for(var item = 0; item < Object.keys(currentOptions).length; item++) {
          options.push({word: Object.keys(currentOptions)[item], code: currentOptions[Object.keys(currentOptions)[item]]});
        }
      }

      options = shuffleOptions(options, answer);
      options.splice(Math.floor(Math.random * 4), 0, baitAnswer);
      options.splice(Math.floor(Math.random * 4), 0, answer)
      service.options.push(options);
      return answer;
    }

    function answersVerbsQuestion(sentence) {
      var answer = sentence.getElementsByTagName('verb');
      var answerObject = {};
      answerObject.word = answer[0].textContent;
      answerObject.code = answer[0].id;
      service.options.push(multipleVerbsOptions(sentence, answerObject));
      return answerObject;
    }

    function answersAdvanced(sentence) {
      var randomAnswer = Math.round((Object.keys(sentence).length - 1) * Math.random());
      var answerObject = { word: Object.keys(sentence)[randomAnswer].replace(/[?,!;.]$/, '').toLowerCase(),
                           code: textService.mapValues(sentence)[randomAnswer].split(',')[0], };
      var answerPosition = Math.round(Math.random() * 4);
      var optionWords = CORE.DEFAULT_WORDS;
      var finalOptions = [];
      for (var option = 0; option < 4; option++) {
        var codeNumber, randomOption, repeating = 0;
          codeNumber = Math.round((Object.keys(optionWords).length - 1) * Math.random());
          randomOption = Object.keys(optionWords)[codeNumber];
        var wordNumber = Math.round((Object.keys(optionWords[randomOption]).length - 1) * Math.random());
        finalOptions.push({code: randomOption, word: optionWords[randomOption][wordNumber]});
      }

      finalOptions = shuffleOptions(finalOptions, answerObject);
      finalOptions.splice(Math.floor(Math.random * 4), 0, answerObject);
      service.options.push(finalOptions);
      return answerObject;
    }

    function multipleVerbsOptions(sentence, answer) {
      var options = [];
      for (var item = 0; item < sentence.childNodes.length; item++) {
        if (sentence.childNodes[item].tagName != 'complete-subject' && sentence.childNodes[item].tagName != 'predicate' && sentence.childNodes[item].tagName != 'verb') {
          var optionObject = {word: sentence.childNodes[item].textContent, code: sentence.childNodes[item].id};
          options.push(optionObject);
        }
      }

      options = shuffleOptions(options, answer)
      options.splice(Math.floor(Math.random * 4), 0, answer);
      return options;
    }

    //UNUSED UNTILL FURTHER NOTICE
    function predicateAndSubject(sentence) {
      var answer;
      var answerCode;
      var askPredicate = Math.round(Math.random());
      if (askPredicate) {
        answer = sentence.getElementsByTagName('predicate');
        answerCode = 'PRDC'
      } else {
        answer = sentence.getElementsByTagName('complete-subject');
        answerCode = 'CPS'
      }

      return {answer: {word: answer[0].textContent, code: answerCode}, questionType: answer[0].tagName};
    }

    function shuffleOptions(options, answer) {
      var repetitions = 5 + Math.floor(Math.random() * 7);
      while(0 != repetitions--) {
        var currentLastOption = options.shift();
        if (!currentLastOption.word.trim().includes(answer.word.trim())) {
          options.push(currentLastOption);
        }
      }

      while(options.length > 4) {
        options.pop();
      }

      return options;
    }

  }

})();
