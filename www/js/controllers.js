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

.controller('HomeController', ['$scope', '$ionicModal' ,'HomeService', 'StaffService', 'ServicesService', 'CustomerService', 'AppoitmnetFactory',  function ($scope, $ionicModal, HomeService, StaffService, ServicesService, CustomerService, AppoitmnetFactory) {
    
  $scope.schedules = [];
  // Form data for the customer modal
  $scope.appoitment = {};

  StaffService.list().then(
    function (response) {
        $scope.staffs = response.data;
    },
    function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
    }
  );

  ServicesService.list().then(
    function (response) {
        $scope.services = response.data;
    },
    function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
    }
  );

  CustomerService.list().then(
    function(response) {
        $scope.customers = response.data;
    }
  );

  $scope.reloadSchedules = function() {
        HomeService.list().then(function(response) {
            $scope.schedules = response.data;
        });
    };

  $ionicModal.fromTemplateUrl('templates/appoitmentDetail.html', {
      scope: $scope
  }).then(function (modal) {
      $scope.appoitmentForm = modal;
  });

  $scope.showAppoitmentModal = function () {
    $scope.appoitment = {};
    $scope.appoitmentForm.show();
  };

  $scope.closeAppoitmentModal = function () {
    $scope.appoitmentForm.hide();
  };

  $scope.bookAppoitment = function() {
    $scope.appoitment.date = Math.round(new Date($scope.appoitment.date).getTime()/1000);
    AppoitmnetFactory.book($scope.appoitment);
    $scope.closeAppoitmentModal();
    $scope.reloadSchedules();
  };

  $scope.reloadSchedules();
    
}])

.controller('CustomerController', ['$scope', '$ionicModal', 'CustomerService', function($scope, $ionicModal, CustomerService) {
    
  $scope.customers = [];
  // Form data for the customer modal
  $scope.customer = {};

    $scope.reloadCustomers = function() {
        CustomerService.list().then(function(response) {
            $scope.customers = response.data;
        });
    };

    $scope.deleteCustomer = function(customer) {

        CustomerService.delete(customer._id).then(function() {
            $scope.reloadCustomers();
        });
    };

    // Create the customer modal that we will use later
    $ionicModal.fromTemplateUrl('templates/customerDetail.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.customerForm = modal;
    });

    $scope.showCustomerModal = function () {
      $scope.customer = {};
      $scope.customerForm.show();
    }

    $scope.editCustomerModal = function (customer) {
      $scope.customer = customer;
      $scope.customerForm.show();
    }

    $scope.closeCustomerModal = function () {
      $scope.customerForm.hide();
    }

    $scope.saveCustomer = function() {
        CustomerService.save($scope.customer);
        $scope.closeCustomerModal();
        $scope.reloadCustomers();
    };

    $scope.reloadCustomers();
  
}])


;
