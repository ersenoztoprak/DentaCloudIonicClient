angular.module('DentaCloud.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  
})

.controller('LoginController', ['$scope', '$localStorage', 'AuthFactory', function ($scope, $localStorage, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe) {
          $localStorage.storeObject('userinfo',$scope.loginData);
        }
           
        AuthFactory.login($scope.loginData);
    };

    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }

}])

.controller('LogoutController', ['$scope', '$ionicHistory', '$state', 'AuthFactory', function ($scope, $ionicHistory, $state, AuthFactory) {

        AuthFactory.logout();

        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $state.go('app.login');


}])

.controller('HomeController', ['$scope' ,'HomeFactory',  function ($scope, HomeFactory) {
    $scope.message = "Loading ...";
    

  HomeFactory.query(
        function (response) {
            console.log(response.data);
            $scope.schedules = response;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    
}])

.controller('CustomerController', ['$scope', 'CustomerService', function($scope, CustomerService) {
    
  $scope.customers = [];

    $scope.reloadCustomers = function() {
        CustomerService.list().then(function(response) {
            $scope.customers = response.data;
        });
    };

    $scope.reloadCustomers();
  
}])


;
