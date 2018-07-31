(function () {
  'use strict';

  angular
  .module('app.progress')
  .controller('ProgressController', ProgressController);

  function ProgressController( $scope,
                               $state,
                               $ionicPopup,
                               $cordovaFacebook,
                               $location,
                               $ionicScrollDelegate,
                               $cordovaSocialSharing,
                               CORE,
                               TEXT,
                               sessionService,
                               facebookService,
                               pronunciationService) {
    var _this = this;
    _this.user = sessionService.getCurrentUser();
    _this.texts = TEXT;
    var GENDER = {MAN: 0, WOMAN: 1};
    _this.knowsProfile = localStorage.getItem('knowsProfile');
    _this.changeImage = changeImage;
    _this.shareEureka = shareEureka;
    _this.getUserInfo = getUserInfo;
    _this.goToLevelProgress = goToLevelProgress;
    _this.goToVocabList = goToVocabList;
    _this.goToTimeDetails = goToTimeDetails;
    _this.goToFacebookFriends = goToFacebookFriends;
    _this.getThreeMoreFriends = getThreeMoreFriends;
    _this.mainMenu = mainMenu;
    _this.myTexts = myTexts;
    _this.logOut = logOut;
    _this.aboutTheApp = aboutTheApp;
    _this.facebookLogin = facebookLogin;
    activate();

    function activate() {
      //todo get friends from db
      _this.additionalFriends = 3;
      if (_this.user.facebook) {
        getFriendRanks();
      }
      var timeStudying = getStudyingTime()
      getLearnedWords();
      _this.timeSpent = timeStudying.time;
      _this.timeFormat = timeStudying.format;
      if (!_this.user.picture) {
        var manPicture = Math.round(Math.random()) + 1;
        _this.user.picture = _this.user.gender != GENDER.MAN ? 'img/profile/boy-' + manPicture + '.png' : 'img/profile/girl-4.png'
      }

      prepareGraph(getProgress());
    }

    function prepareGraph(progressData) {
      var resultsContext = document.getElementById("progress").getContext('2d');
      var resultsCanvas = new Chart(resultsContext, {
        type: 'doughnut',
        data: {
          labels: ['Dominado', 'Faltante'],
          datasets: [{
            label: 'Progreso',
            backgroundColor: ['#387ef5', 'orange'],
            data: progressData,
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

    function getProgress() {
      var levelBoundaries = [38.104, 85.734, 152.416, 238.15, 342.936, 466.773];
      var completed = _this.user.points / levelBoundaries[_this.user.level - 1];
      return [Math.ceil(completed * 100), Math.floor((1 - completed) * 100)];
    }

    function getStudyingTime() {
      var totalSeconds = sessionService.getStudyingTime(),
        totalMinutes = totalSeconds > 59 ? totalSeconds / 60 : 0,
        totalHours = totalMinutes > 59 ? totalMinutes / 60 : 0,
        totalDays = totalHours > 23 ? totalHours / 24 : 0;
      if (totalMinutes == 0) {
        totalSeconds = Math.round(totalSeconds * 10) / 10;
        return {time: totalSeconds, format: TEXT.TIME_SECONDS};
      } else if (totalHours == 0) {
        totalMinutes = Math.round(totalMinutes * 100) / 100;
        return {time: totalMinutes, format: TEXT.TIME_MINUTES};
      } else if (totalDays == 0) {
        totalHours = Math.round(totalHours * 100) / 100;
        return {time: totalHours, format: TEXT.TIME_HOURS};
      } else {
        totalDays = Math.round(totalDays * 100) / 100;
        return {time: totalDays, format: TEXT.TIME_DAYS};
      }
    }

    function getLearnedWords() {
      var wordWeights = pronunciationService.getGlobalWeights(), vocab = CORE.VOCABULARY_EN[_this.user.level],
        vocab1 = [], vocab2 = [];
      _this.learnedWords = 0;

      for (var vocabWord =  0; vocabWord < vocab.length; vocabWord++) {
        vocab[vocabWord] = vocab[vocabWord].charAt(0).toUpperCase() + vocab[vocabWord].substring(1, vocab[vocabWord].length);
        var currentWord = {word: vocab[vocabWord]};
        if (wordWeights && wordWeights[vocab[vocabWord]] && wordWeights[vocab[vocabWord]].value > 0.6) {
          currentWord.learned = true;
          _this.learnedWords++;
        } else {
          currentWord.learned = false;
        }

        if (vocabWord%2 == 0) {
          vocab1.push(currentWord);
        } else {
          vocab2.push(currentWord);
        }
      }

      _this.vocabulary = {leftColumn: vocab1, rightColumn: vocab2};
    }

    function getFriendRanks() {
      for (var friend = 0; friend < _this.user.friends.length; friend++) {
        _this.user.friends[friend].picture = "https://graph.facebook.com/" + _this.user.friends[friend].id + "/picture?width=300&height=300";
      }
    }

    function getThreeMoreFriends() {
      _this.additionalFriends += 3;
    }

    function getUserInfo(index) {
      $ionicPopup.alert({
        title: _this.user.friends[index].name ? _this.user.friends[index].name : TEXT.UNKNOWN_USER,
        template: '100 points',
        okType: 'dark',
      });
    }

    function changeImage() {
      localStorage.setItem('knowsProfile', true);
      $state.go('profile-picture');
    }

    function shareEureka() {
      var shareURL = ionic.Platform.isIOS() ? 'https://www.google.com/#q=eureka+ios' : 'https://www.google.com/#q=eureka+android';
      $cordovaSocialSharing.share(TEXT.SHARE_MESSAGE, TEXT.SHARE_TITLE, "www/img/logo.png", shareURL);
    }

    function goToVocabList() {
      $location.hash('vocab-info');
      $ionicScrollDelegate.anchorScroll();
    }

    function goToTimeDetails() {

    }

    function goToLevelProgress() {
     $location.hash('level-info');
     $ionicScrollDelegate.anchorScroll();
   }

    function goToFacebookFriends() {
      $location.hash('friends-info');
      $ionicScrollDelegate.anchorScroll();
    }

    function facebookLogin() {
      facebookService.previousUser = _this.user;
      facebookService.fromProgress = true;
      facebookService.login();
    }

    function logOut() {
      //TODO: SAVE PRONUNCIATION WEIGHTS ON DB PRIOR TO DELETING
      localStorage.removeItem('userSession');
      localStorage.removeItem('shareMessage');
      $cordovaFacebook.logout('Goodbye!');
      $state.go('home');
    }

    function myTexts() {
      $state.go('texts');
    }

    function mainMenu() {
      $state.go('main');
    }

    function aboutTheApp() {
      $state.go('about-app');
    }

 }
})();
