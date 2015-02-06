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

function rbView(rbState, $compile){
    return {
        restrict: 'E',
        link: function(scope, elem, attrs){
            var name = attrs.name;

            scope.$on('stateChangeSuccess', function(){
                updateView(false);
            });

            updateView(true);

            function updateView(firstTime){
                if(!rbState.current){ return; }

                if((firstTime && !name) || (name === rbState.current.name)){
                    var html = $compile(rbState.current.config.template)(scope);
                    elem.empty().append(html);
                }
            }
        }

    };
}