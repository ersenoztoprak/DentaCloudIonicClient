'use strict';


angular.module('DentaCloud.services', ['ngResource'])
.constant("baseURL", "http://localhost:4000/")
.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', '$ionicPopup','$state', '$ionicHistory', 'baseURL', function($resource, $http, $localStorage, $rootScope, $window, $ionicPopup, $state, $ionicHistory, baseURL){
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;
    
  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  } 

  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    if (credentials.username !== undefined) {
      useCredentials(credentials);
    }
  }
 
  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }

  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }
 
  
     
    authFac.login = function(loginData) {
        
        $resource(baseURL + "users/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.token});
              $rootScope.$broadcast('login:Successful');

              $ionicHistory.nextViewOptions({
                disableBack: true
              });

              $state.go('app.schedule');
           },
           function(response){
              isAuthenticated = false;
            
              var message = '<div><p>' +  response.data.err.message + 
                  '</p><p>' + response.data.err.name + '</p></div>';
            
               var alertPopup = $ionicPopup.alert({
                    title: '<h4>Login Failed!</h4>',
                    template: message
                });

                alertPopup.then(function(res) {
                    console.log('Login Failed!');
                });
           }
        
        );

    };
    
    authFac.logout = function() {
    	$resource(baseURL + "users/logout").get(function(response){
        });
        destroyUserCredentials();
    };
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;  
    };

    loadUserCredentials();
    
    return authFac;
    
}])

.service('HomeService', ['$http', 'baseURL', function($http, baseURL) {

  return {
        list: function() {
            return $http.get(baseURL + 'appoitments');
        }
  };

}])

.service('CustomerService', [ '$http', 'baseURL', function($http, baseURL) {

    return {
        list: function() {
            return $http.get(baseURL + 'customers');
        },
        delete: function(id) {
            return $http.delete(baseURL + 'customers/' + id);
        },
        save: function (customerData) {
          if (customerData._id) {
            return $http.put(baseURL + 'customers/' + customerData._id, customerData);
          }
          else {
            return $http.post(baseURL + 'customers', customerData);
          }
        }
        
    };
}])

.service('StaffService', [ '$http', 'baseURL', function($http, baseURL) {

    return {
        list: function() {
            return $http.get(baseURL + 'staffs');
        },
        delete: function(id) {
            return $http.delete(baseURL + 'staffs/' + id);
        }
    };
}])

.service('ServicesService', [ '$http', 'baseURL', function($http, baseURL) {

    return {
        list: function() {
            return $http.get(baseURL + 'services');
        },
        delete: function(id) {
            return $http.delete(baseURL + 'services/' + id);
        }
    };
}])

.service('AppointmentService', ['$http', '$ionicPopup', 'baseURL', function($http, $ionicPopup, baseURL) {

  return {
    book: function(appoitmentData) {

        if (appoitmentData._id) {
            return $http.put(baseURL + 'appoitments/' + appoitmentData._id, appoitmentData);
        }
        else {
            return $http.post(baseURL + 'appoitments', appoitmentData);
        }
    },

    delete: function(id) {
        return $http.delete(baseURL + 'appoitments/' + id);
    }
  };

}])

;
