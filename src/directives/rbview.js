angular.module('app').directive('rbView', function($controller, $compile, rbState){
    return {
        restrict : 'E',
        link :link,
        scope : {
            resolve : '&',
            name : '@'
        }
    };

    function link(scope, elem){
        var controllerName = scope.name + '.mainController',
            featureScope = scope.$new(),
            stateName = scope.$parent.data.stateName,
            state = rbState.get(stateName),
            view = state.views[scope.name + '@' + stateName],
            content = view.template,
            CONTROLLER_AS = 'main',
            layerSlide = {resolve:scope.resolve};

        // compile body with new scope
        content = $compile(content)(featureScope);

        // remove current html
        elem.html('');

        // append newly created content
        elem.append(content);

        // add feature controller to the scope and make it available with controller as main
        featureScope[CONTROLLER_AS] = $controller(controllerName, {$scope:featureScope, layerSlide : layerSlide, app:view.resolve.app()});
    }
});