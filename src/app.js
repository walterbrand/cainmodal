angular.module('feature',[]);
angular.module('app',['feature'])
    .provider('rbState', function(){
        var states = {};
        return {
            state : state,
            $get: $get
        }

        function state(stateObj){
            states[stateObj.name] = stateObj;
        }
        function $get(layermanager, $timeout){
            return {
                go:go,
                get: get
            };
            function go(name){
                var state = states[name],
                    compositeApplication = state.views[''].template;

                $timeout(function(){
                    layermanager.dispatch('modal',{
                        template : compositeApplication,
                        controller : 'caModalController',
                        data : {stateName: name}
                    })
                })
            }
            function get(name) {
                return states[name];
            }

        }
    })
    .config( function(rbStateProvider){
    var homeState = {
        name:'home',
        views: {
            '':{
                template:'<b>Home<rb-view name="featureQ"></rb-view></b>' // ui-view should become rb-view
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
    }
    rbStateProvider.state(homeState);

    /* should become something like:
        rbStateProvider.state('home', homeState)
    */
}).controller('featureQ.mainController', function(app){
        var vm = this;
        vm.waarde = app.q;
    }).run(function(rbState){
        rbState.go('home')
    });