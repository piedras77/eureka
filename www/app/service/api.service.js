(function() {
	'use strict';

	angular
		.module('app')
		.service('apiService', apiService);

	function apiService( $http,
						 $ionicLoading,
						 $ionicPopup,
						 $state,
						 $rootScope,
						 $q,
						 $cordovaFacebook,
						 sessionService,
						 TEXT,
						 CORE ) {

		var texts = TEXT;
		var userLoginURL = CORE.API_URL + 'users/login';
		var usersUrl = CORE.API_URL +  'users';
		var textsURL = CORE.API_URL + 'texts/level/as_max/';
		var apiHeaders = {
			headers: {
				'EUREKAAUTHTOKEN': CORE.AUTH_TOKEN
			}
		};

		var service = {
			login: login,
			signup: signup,
			updateUser: updateUser,
			handleSuccessfulLogin: handleSuccessfulLogin,
			handleInvalidLogin: handleInvalidLogin,
			selectLevel: selectLevel,
			logout: logout,
			getTexts: getTexts,
			getUserByFacebookId: getUserByFacebookId,
			message: message,
		};

		return service;

		function login(user) {
			$ionicLoading.show();
			apiHeaders.headers['Authorization'] = 'Basic ' + btoa( user.email + ':' + user.password );
			$http.get(userLoginURL, apiHeaders)
				.then( function(result) {
					if (user.facebook) {
						result.data.user.friends = user.friends;
						result.data.user.picture = user.picture;
					}

					handleSuccessfulLogin(result.data.user);
				}, function (error) {
					if (user.facebook && error.status == 404)
						selectLevel(user);
					else 
						handleInvalidLogin();
				});
		}

		function logout() {
			localStorage.removeItem('pronunciationWeights');
		    $ionicLoading.show();
		    var user = sessionService.getCurrentUser();
		    var updatePromise = updateUser(sessionService.getCurrentUser());
	        updatePromise.then(function (result) {
	        	$ionicLoading.hide();
	          if (user.facebook)
	            $cordovaFacebook.logout();
	        
	          localStorage.removeItem('userSession');
	          localStorage.removeItem('shareMessage');
	          $state.go('home');
	        }, function (error) {
	        	$ionicLoading.hide();
	            $ionicPopup.alert ( {
	              title: TEXT.ERROR_TITLE,
	              template: TEXT.ERROR_MESSAGE,
	              okText: TEXT.OK_BUTTON
	            });
	        });
		}

		function signup(user) {
			console.log(user);
			// if (user)
			$ionicLoading.show()
			$http({
				method: 'POST', 
				url: usersUrl + getParameters(user),
				headers: apiHeaders.headers
			}
			).then( function(result) {
				user.id = result.data.id;
				handleSuccessfulSignup(user);
			}, function(error) {
				handleInvalidSignup();
			});
		}

		function updateUser(user) {
			return $q(
				function (resolve, reject) {
					$http( {
						method:'PUT',
						url: usersUrl + '/id/' + user.id + getParameters(user),
						headers: apiHeaders.headers
					} ). then( function(result) {
						console.log(result);
						if (result.status == 204)
							reject()

						result.data.user.level = Math.ceil(3.24 * Math.sqrt(result.data.user.points) / 10);
		      			sessionService.setCurrentUser(result.data.user);
		      			resolve( sessionService.getCurrentUser() );
					}, function(error) {
						reject();
					} ) 
				}
			); 		
		}

		function getUserByFacebookId(id) {
			return $q (
				function (resolve, reject) {
					$http.get( usersUrl + '/fb_id/' + id, apiHeaders)
						.then(function (result) {
							resolve(result.data.user);
						}, function (error) {
							resolve(null);
						});
				}
			);
		}

		function getTexts(pageNumber) {
			return $q (
				function(resolve, reject) {
					$http.get(textsURL + sessionService.getCurrentUser().level + '?' + 'page=' + pageNumber)
						.then( function(result) {
							resolve(result.data.texts);
						}, function(error) {
							message( TEXT.ERROR_TITLE, TEXT.ERROR_MESSAGE_TEXTS_SP);
							reject();
						});
				}
			);
		}

		function handleSuccessfulLogin(user) {
	      user.level = Math.ceil(3.24 * Math.sqrt(user.points) / 10);
	      user.level = CORE.MAX_LEVEL < user.level ? CORE.MAX_LEVEL : user.level;
	      sessionService.setCurrentUser(user);
	      localStorage.setItem('shareMessage', true);
	      $ionicLoading.hide();
	      $state.go('main');
	    }

	    function handleInvalidLogin() {
	      $ionicLoading.hide();
	      message(texts.ERROR_TITLE, texts.INVALID_LOGIN_MESSAGE);
	    }

	    function handleSuccessfulSignup(user) {
	    	user.admin = 0;
	    	user.level = Math.ceil(3.24 * Math.sqrt(user.points) / 10);
	      	user.level = CORE.MAX_LEVEL < user.level ? CORE.MAX_LEVEL : user.level;
      		sessionService.setCurrentUser(user);
      		$ionicLoading.hide();
      		message(TEXT.VALID_SIGNUP_TITLE, TEXT.VALID_SIGNUP_MESSAGE);
      		$state.go('main');
	    }

	    function handleInvalidSignup() {
	    	$ionicLoading.hide();
	     	message(texts.INVALID_SIGNUP_TITLE, texts.INVALID_SIGNUP_MESSAGE);
	    }

	    function getParameters(user) {
	    	return '?' + 'email=' + user.email + '&name=' + user.name +
				'&password=' + user.password + '&points=' + user.points +
				'&admin=0' + '&facebook=' + user.facebook + '&facebook_id=' + user.facebook_id + 
				'&gender=' + user.gender + '&age=' + user.age + '&signup_time=' + user.signup_time;
			
	    }

	    function message(title, message) {
	      $ionicPopup.alert({
	        title: title,
	        template: message,
	        cssClass: 'align-center',
	      });
	    }

	    function selectLevel(user) {
	    	$ionicLoading.hide();
	        $rootScope.data = {};
	        $rootScope.data.levelInfo = ['Principiante', 'Principiante-Intermedio', 'Principiante-Avanzado', 'Intermedio-Básico', 'Intermedio-Medio', 'Intermedio-Avanzado'
	            , 'Avanzado-Básico', 'Avanzado-Intermedio', 'Avanzado']; 

	        $ionicPopup.alert({
	            title: 'Nivel actual de Inglés',
	            scope: $rootScope,
	            cssClass: "radio-input",
	            template: '<div class="list"><label class="item" ng-repeat="level in data.levelInfo"><input class="input" ng-model="data.selectedLevel" ng-value="level" type="radio">{{level}}</label></div>'
	          }).then(function (result){
	            switch($rootScope.data.selectedLevel) {
	              case $rootScope.data.levelInfo[0]:
	                user.points = 3;
	              break;
	              case $rootScope.data.levelInfo[1]:
	                user.points = 10;
	              break;
	              case $rootScope.data.levelInfo[2]:
	                user.points = 39;
	              break;
	              case $rootScope.data.levelInfo[3]:
	                user.points = 67;
	              break;
	              case $rootScope.data.levelInfo[4]:
	                user.points = 123;
	              break;
	              case $rootScope.data.levelInfo[5]:
	               user.points = 209;
	              break;
	              case $rootScope.data.levelInfo[6]:
	                user.points = 303;
	              break;
	              case $rootScope.data.levelInfo[7]:
	                user.points = 427;
	              break;
	              case $rootScope.data.levelInfo[8]:
	                user.points = 590;
	              break;
	            }
	            
	            signup(user);
	        });
	    }
	}

})();