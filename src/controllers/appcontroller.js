angular.module('app').controller('AppController',function(layermanager){
    var vm = this;

    // at this stage the fragment is already prepared and has rb-view directives
    // for each feature on the fragment Composite Application

    var featureModuleHtml = '<div ng-click="main.close()">{{main.somevalue}} click on me to close the modal</div>',

        fragmentCA = '<div>Some regular content<br />' +
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