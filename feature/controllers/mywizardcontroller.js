angular.module('app').controller('myWizardController', function(wizard){
    var vm = this;

    vm.next = wizard.next;
    vm.previous = wizard.previous;
});