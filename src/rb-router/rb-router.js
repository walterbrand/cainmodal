angular.module('rb.router', []);

angular.module('rb.router').provider('rbState', rbStateProvider);
angular.module('rb.router').directive('rbView', rbView);

function rbStateProvider(){
    var states = {};

    return {
        state: function(name, config){
            states[name] = config;
        },
        $get: function($rootScope) {
            return {
                current: null,
                go: function(name) {
                    var config = states[name];

                    if (config) {
                        this.current = {
                            name: name,
                            config: config
                        };

                        $rootScope.$broadcast('stateChangeSuccess');
                    }else{
                        throw new Error('No configuration for state: \'' + name + '\'');
                    }
                }
            };
        }

    };
}

function rbView(rbState, $compile, $controller){
    return {
        restrict: 'E',
        link: function(scope, elem, attrs){
            var name = attrs.name;

            scope.$on('stateChangeSuccess', function(){
                console.log('ddd');
                updateView(false);
            });

            updateView(true);

            function updateView(firstTime){
                if(!rbState.current){ return; }

                var viewName = (name) ? name + '@' + rbState.current.name : '',
                    view = rbState.current.config.views[viewName];

                if((firstTime && !name) || view){
                    var viewScope = scope.$new(),
                        dependencies = (function(){
                            var result = {
                                $scope: viewScope
                            };

                            if(view.resolve){
                                angular.forEach(view.resolve, function(val, prop){
                                    result[prop] = angular.isFunction(val) ? val() : val;
                                });
                            }

                            return result;
                        }()),
                        controller = (view.controller) ? $controller(view.controller, dependencies) : null;

                    if(view.controllerAs){
                        viewScope[view.controllerAs] = controller;
                    }

                    var html = $compile(view.template)(viewScope);
                    elem.empty().append(html);
                }
            }
        }

    };
}