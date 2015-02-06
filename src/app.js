angular.module('feature',[]);
angular.module('app',['feature', 'ui.router', 'rb.router'], function(rbStateProvider, $stateProvider){

    var homeState = {
        name:'home',
        views: {
            '': {
                template: '<b>Home<rb-view name="featureQ">ddd</rb-view></b>'
            },
            'featureQ@home': {
                template:'<div>my value is {{main.waarde}}</div>',
                controller : 'featureQ.mainController',
                controllerAs : 'main',
                resolve : {
                    app: function(){return {q:6}}
                }
            }
        }
    };
    rbStateProvider.state('home', homeState);


    var homeState = {
        name:'home',
        views: {
            '':{
                template:'<b>Home<ui-view name="featureQ"></ui-view></b>' // ui-view should become rb-view
            },
            'featureQ@home': {
                template:'<div>my value is {{main.waarde}}</div>',
                controller : 'featureQ.mainController',
                controllerAs : 'main',
                resolve : {
                    app: function(){return {q:6}}
                }
            }
        }
    };
    $stateProvider.state('home', homeState);

    /* should become something like:
        rbStateProvider.state('home', homeState)
    */
}).run(function($state, rbState){
        $state.go('home');
        rbState.go('home');
        /*
            should become something like rbState.go('home')
            the template in view '' should be the template that is passed to
            layermanager.dispatch({
                template : the emptystring view
                controller: camodalcontroller,
                data: the homestate object
            })
         */

}).controller('featureQ.mainController', function(app){
        var vm = this;
        vm.waarde = app.q;
    });