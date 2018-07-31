(function () {
  'use strict';

  angular
    .module('app')
    .service('classifyService', classifyService);

  function classifyService(CORE, textService) {
    var optionCodes = {'i': 'PP1', 'me': 'PP1', 'we': 'PP4', 'us': 'PP4', 'you': 'PP2', 'you': 'PP5', 'she': 'PP3',
        'her': 'PP3', 'he': 'PP3', 'him': 'PP3', 'they': 'PP6', 'it': 'PP7', 'that': 'PD2', 'which': 'XZ2', 'who': 'XZ1',
        'this': 'PD1', 'these': 'PD3', 'those': 'PD4', 'anyone': 'PII', 'anything': 'PII', 'am': 'VTB1',
        'are': 'VTB2', 'is': 'VTB3', 'will be': 'VTBSF', 'have': 'VTH1', 'has': 'VTH2'};
    var possessiveCodes = {'mine': 'PPP1', 'yours': 'PPP2', 'his': 'PPP3', 'hers': 'PPP4', 'ours': 'PPP5',
      'yours': 'PPP6', 'their': 'PPP7'};
    var QUESTION = {SENTENCE_COMPONENTS: 0, VERBS_TB_TH: 1, PRONOUNS: 2, VERBS: 3, SINCE_FOR: 4, INTERROGATIVES: 5};
    var QUESTION_FUNCTIONS = [questionSentenceComponents, questionVTBVTH, questionPronouns, questionVerbs, questionSinceFor, questionInterrogatives];
    var OPTIONS_FUNCT = [optionsSentenceComponents, optionsVTBTH, optionsPronouns, optionsVerbs, optionsSinceFor, optionsInterrogatives];
    var VTB_VTH = [{word: 'verb-to-be', code: 'VTB'}, {word: 'verb-to-have', code: 'VTH'}];
    var SENTENCE_COMPONENTS = [{word: 'predicate', code: 'PRDC'}, {word: 'complete-subject', code: 'CPS'}];
    var service = {
      XMLParser: new DOMParser(),
      getOptions: getOptions,
      getQuestions: getQuestions,
    };

    return service;

    function getOptions() {
      return service.questionOptions;
    }

    function getQuestions(userLevel, sentences, isAdvancedText) {
      service.questionOptions = [];
      if (isAdvancedText) {
        return setAdvancedQuestions(sentences, userLevel);
      } else {
        return setQuestions(sentences, userLevel);
      }
    }

    function setQuestions(sentences, level) {
      var sentencesReady = [];
      var sentenceParts;
      var questionType;
      var repeat;

      for (var sentence = 0; sentence < sentences.length; sentence++) {
        do {
          repeat = false;
          level = level == 6 ? 5 : level;
          questionType = Math.floor((level + 1) * Math.random());
          var completeSubject = sentences[sentence].getElementsByTagName('complete-subject')[0];
          completeSubject = completeSubject.id == 'implicit' || completeSubject.id == 'inPredicate' ? '' : completeSubject.textContent;
          var predicate = sentences[sentence].getElementsByTagName('predicate')[0].textContent;
          sentenceParts = {part1: completeSubject, part2: predicate, completeSentence: (completeSubject + ' ' + predicate).toLowerCase()};
          sentenceParts = QUESTION_FUNCTIONS[questionType](sentenceParts.completeSentence, sentenceParts, sentences[sentence]);
          if (!sentenceParts) {
            repeat = true;
          }
        } while(repeat);

        var partsArray = splitSentence(sentenceParts.completeSentence, sentenceParts.answer.questionWord);
        sentenceParts.part1 = textService.capitalize(partsArray.part1);
        sentenceParts.part2 = partsArray.part2;
        sentenceParts.completeSentence = textService.capitalize(sentenceParts.completeSentence);
        service.questionOptions.push(OPTIONS_FUNCT[questionType](sentenceParts.answer, sentences[sentence]));
        if (sentenceParts.part1.length == 0) {
          sentenceParts.answer.questionWord = textService.capitalize(sentenceParts.answer.questionWord);
        }

        sentencesReady.push(sentenceParts);
      }
      return sentencesReady;
    }

    function splitSentence(completeSentence, answerWord) {
      answerWord = answerWord.toLowerCase();
      completeSentence = '****' + completeSentence.replace(/[{,}]/g, '') + '****';
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

    function questionInterrogatives(completeSentence, sentenceParts, XMLSentence) {
      var questionWord = {textContent: XMLSentence.getElementsByTagName('interrogative')[0]};
      if (!questionWord.textContent) {
        return false;
      }

      questionWord.tagName = 'interrogative';
      if (questionWord.textContent.id) {
        questionWord.tagName += 'type';
      }

      questionWord.textContent = questionWord.textContent.textContent.toLowerCase();
      sentenceParts.answer = {code: CORE.INTERROGATIVES_CODES[questionWord.textContent],
        questionWord: questionWord.textContent, option: questionWord.tagName}
      return sentenceParts;
    }

    function questionSinceFor(completeSentence, sentenceParts, XMLSentence) {
      var wordType = XMLSentence.getElementsByTagName('since-time')[0];
      wordType = wordType ? wordType : XMLSentence.getElementsByTagName('for-time')[0];
      if (!wordType) {
        return false;
      }

      var questionWord =  {
        tagName: wordType.tagName == 'since-time' ? 'point-of-time' : 'period-of-time',
        textContent: wordType.tagName == 'since-time' ? 'since' : 'for'
      };

      sentenceParts.answer = {questionWord: questionWord.textContent,
        code: questionWord.tagName == 'since' ? 'ZS' : 'ZF', option: questionWord.tagName};
      return sentenceParts;
    }

    function questionVerbs(completeSentence, sentenceParts, XMLSentence) {
      var questionWord = XMLSentence.getElementsByTagName('verb')[0];
      if (!questionWord) {
        return false;
      }

      var optionWord =  CORE.CODES_MEANING[questionWord.id];
      if (optionWord) {
        optionWord = optionWord[0].replace(/[\s,\"]/g, '-');
      } else {
        optionWord = 'no-disponible-aun';
      }

      sentenceParts.answer = {code: questionWord.id, questionWord: questionWord.textContent.toLowerCase(),
        option: optionWord};
      return sentenceParts;
    }

    function questionPronouns(completeSentence, sentenceParts, XMLSentence) {
      var questionWord = XMLSentence.getElementsByTagName('pronoun')[0];
      if (!questionWord) {
        return false;
      }

      sentenceParts.answer = {questionWord: questionWord.textContent.toLowerCase(),
        code: questionWord.id, option: 'pronoun'};

      sentenceParts.answer.option += '-answer';
      return sentenceParts;
    }

    function questionVTBVTH(completeSentence, sentenceParts, XMLSentence) {
      var verbWord = XMLSentence.getElementsByTagName('verb-to-be')[0];
      verbWord = verbWord ? verbWord : XMLSentence.getElementsByTagName('verb-to-have')[0];
      if (!verbWord) {
        return false;
      }

      sentenceParts.answer = {option: verbWord.tagName, questionWord: verbWord.textContent.toLowerCase()};
      sentenceParts.answer.code = optionCodes[sentenceParts.answer.questionWord];
      return sentenceParts;
    }

    function questionSentenceComponents(completeSentence, sentenceParts, XMLSentence) {
      var askSubject = Math.round(Math.random()) >= 0.5 ? true: false;
      var questionPart =  askSubject  ? sentenceParts.part1 : sentenceParts.part2;
      if (questionPart == '') {
        questionPart = !askSubject ? sentenceParts.part1 : sentenceParts.part2;
      }

      sentenceParts.answer = {code: askSubject ? 'CPS' : 'PRDC', option: askSubject ? 'complete-subject' : 'predicate',
        questionWord: questionPart.toLowerCase()};
      return sentenceParts;
    }

    function optionsInterrogatives(sentenceParts) {
      var options = SENTENCE_COMPONENTS.concat(VTB_VTH).concat([{word: 'pronoun', code: 'P'}]);
      //TODO: add options specitfically for interrogatives
      return shuffleOptions(options,
        {word: sentenceParts.option, code: sentenceParts.code});
    }

    function optionsSinceFor() {
      return [{word: 'point-of-time', code: 'ZS'}, {word: 'period-of-time', code: 'ZF'}];
    }

    function optionsVerbs(sentenceParts, XMLSentence) {
      var verbsInText = Array.prototype.slice.call(XMLSentence.childNodes);
      var options = [];
      for (var verb = 0; verb < verbsInText.length; verb++) {
        if (verbsInText[verb].id) {
          options.push({word: verbsInText[verb].tagName, code: verbsInText[verb].id});
        }
      }

      return shuffleOptions(options,
        {word: sentenceParts.option, code: sentenceParts.code});
    }

    function optionsPronouns(sentenceParts) {
      var pronounType = sentenceParts.code.replace(/[0-9]/g, '');
      var options = [];
      if (pronounType == 'PD' || pronounType == 'PII') {
        var pronounCategories = ['PD', 'PII', 'PP', 'PPP'];
        for (var pronoun in pronounCategories) {
          options.push({word: CORE.CODES_MEANING[pronounCategories[pronoun]][0].replace(' ', '-'), code: pronounCategories[pronoun]});
        }
      } else {
        var pronounSubcategory, pronounPerson = 1;
        do {
          pronounSubcategory = CORE.CODES_MEANING[(pronounType + pronounPerson)];
          if(pronounSubcategory) {
            pronounSubcategory = pronounSubcategory[0].replace(' ', '-');
            options.push({word: pronounSubcategory, code: (pronounType + pronounPerson++)});
          }
        } while (pronounSubcategory);
      }

      return shuffleOptions(options, {word: sentenceParts.option, code: sentenceParts.code});
    }

    function optionsVTBTH(sentenceParts) {
      return shuffleOptions(VTB_VTH.concat(SENTENCE_COMPONENTS),
        {word: sentenceParts.option, code: sentenceParts.code});
    }

    function optionsSentenceComponents(sentenceParts) {
      return shuffleOptions(SENTENCE_COMPONENTS.concat(VTB_VTH),
        {word: sentenceParts.option, code: sentenceParts.code});
    }

    function setAdvancedQuestions(sentences, level) {
      var sentencesReady = [];
      for (var sentence = 0; sentence < sentences.length; sentence++) {
        var sentenceParts = {part1: sentences[sentence].getElementsByTagName('complete-subject')[0].textContent,
          part2: sentences[sentence].getElementsByTagName('predicate')[0].textContent};
        var cleanedText = textService.getSentenceJSON(sentenceParts.part1 + ' ' + sentenceParts.part2);
        var randomQuestionWord = Math.floor(Math.random() * Object.keys(cleanedText.wordObjects).length);
        sentenceParts.answer = {word: CORE.CODES_MEANING[textService.mapValues(cleanedText.wordObjects)[randomQuestionWord]],
          code: textService.mapValues(cleanedText.wordObjects)[randomQuestionWord], questionWord: Object.keys(cleanedText.wordObjects)[randomQuestionWord]};
        sentenceParts.answer.word = sentenceParts.answer.word ? sentenceParts.answer.word[1].replace('\s', '-') : 'no-disponible-aun';
        var splitString = sentenceParts.answer.questionWord;
        if (randomQuestionWord == 0) {
          splitString += ' ';
        } else if (randomQuestionWord == cleanedText.wordObjects.length) {
          splitString = ' ' + splitString;
        } else {
          splitString = ' ' + splitString + ' ';
        }

        var advancedOptions = getAdvancedOptions();
        advancedOptions.splice(Math.floor(Math.random() * 4), 0, sentenceParts.answer);
        var sentenceArray = cleanedText.text.split(sentenceParts.answer.questionWord);
        sentenceParts.part1 = sentenceArray[0];
        sentenceArray.shift();
        sentenceParts.completeSentence = cleanedText.text;
        sentenceParts.part2 = sentenceArray.join(sentenceParts.answer.questionWord);
        service.questionOptions.push(advancedOptions);
        sentencesReady.push(sentenceParts);
      };

      return sentencesReady;
    }

    function getAdvancedOptions() {
      var options = [];
      for (var option = 0; option < 4; option++) {
        var randomOption = Math.floor(Math.random() * Object.keys(CORE.CODES_MEANING).length);
        options.push({word: textService.mapValues(CORE.CODES_MEANING)[randomOption][1].replace(' ' , '-'),
          code: Object.keys(CORE.CODES_MEANING)[randomOption]});
      }

      return options;
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

      if (answer) {
        options.splice(Math.floor(Math.random() * 4), 0, answer);
      }

      return options;
    }
  }
})();
