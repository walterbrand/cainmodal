angular.module('app').controller('AppController',function(layermanager){
    var vm = this;

    // at this stage the fragment is already prepared and has rb-view directives
    // for each feature on the fragment Composite Application

    var featureModuleHtml = '<div ng-click="main.close()">{{main.somevalue}} click on me to close the modal</div>',

        fragmentCA = '<div>Some regular content<br />' +
            '<wizard ng-controller="myWizardController as mwc">' +
                '<wizard-step name="step1">stap 1<br /><button ng-click="mwc.next()">Next</button></wizard-step>' +
                '<wizard-step name="step2">stap 2<br /><button ng-click="mwc.previous()">Previous</button></wizard-step>' +
            '</wizard>'+
            '<rb-view name="feature" resolve="data.resolve()">' +
                featureModuleHtml
            '</rb-view>' +
        '</div>';

    vm.openCAInModal = function() {
        layermanager.dispatch('modal',{
            template : fragmentCA,
            controller : 'caModalController',
            data : {}
        })
    }
});