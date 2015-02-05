angular.module('app').directive('rbView', function($controller, $compile){
    return {
        restrict : 'E',
        link :link,
        scope : {
            //resolve : '&',
            name : '@',
            modalController: '='
        }
    }

    function link(scope, elem){
        var controllerName = scope.name + '.maincontroller',
            featureScope = scope.$new(),
            content = elem.html(),
            CONTROLLER_AS = 'main';
            //layerSlide = {resolve:scope.resolve};

        // compile body with new scope
        content = $compile(content)(featureScope);

        // remove current html
        elem.html('');

        // append newly created content
        elem.append(content);

        // add feature controller to the scope and make it available with controller as main
        featureScope[CONTROLLER_AS] = $controller(controllerName, {$scope:featureScope, modalCtrl : scope.modalController});
    }
});