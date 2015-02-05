angular.module('feature').controller('feature.maincontroller', function(modalCtrl){
    var vm = this;
    vm.somevalue = "My Value, ";

    vm.close = function(){
        console.log('closing the modal via a feature');
        modalCtrl.resolve();
    }


});