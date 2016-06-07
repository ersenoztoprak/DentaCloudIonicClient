// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('DentaCloud', ['ionic', 'ngMessages', 'DentaCloud.controllers', 'DentaCloud.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.customers', {
    url: '/customers',
    views: {
      'menuContent': {
        templateUrl: 'templates/customer.html',
        controller: 'CustomerController'
      }
    }
  })

  .state('app.staff', {
      url: '/staffs',
      views: {
        'menuContent': {
          templateUrl: 'templates/staff.html',
          controller: 'StaffController'
        }
      }
    })
    .state('app.schedule', {
      url: '/schedule',
      views: {
        'menuContent': {
          templateUrl: 'templates/schedule.html',
          controller: 'HomeController'
        }
      }
    })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
      }
    }
  })

  .state('app.logout', {
    url: '/logout',
    views: {
      'menuContent': {
        controller: 'LogoutController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
