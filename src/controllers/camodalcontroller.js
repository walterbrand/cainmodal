angular.module('app').controller('caModalController',function($scope, $timeout){
    var vm = this;
/*
    $scope.data = {
        resolve : function(){
            console.log('receiving a close call from a feature');
            vm.resolve();
        }
    }
*/
    $timeout(function(){console.log($scope)})

});