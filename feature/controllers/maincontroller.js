angular.module('feature').controller('feature.maincontroller', function(layerSlide){
    var vm = this;
    vm.somevalue = "My Value, ";

    vm.close = function(){
        console.log('closing the modal via a feature');
        layerSlide.resolve();
    }


});