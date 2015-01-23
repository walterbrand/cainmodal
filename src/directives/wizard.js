angular.module('app').directive('wizard',function($compile, $controller){
    return {
        restrict : 'E',
        compile : compile,
        scope : false,
        terminal : true,
        priority: 501
    }

    function compile(elem, attr){
        var stepNames = [],
            activeStepName;

        angular.forEach(elem.find('wizard-step'), function(step, index){
            var $step = angular.element(step),
                stepName = $step.attr('name');

            // gathering all step names
            stepNames.push(stepName);

            // the active step index is by default 0
            if (index === 0) {
                activeStepName = stepName;
            }

            // adding the show/hide condition to the step
            $step.attr('ng-if', 'isActiveStep(\''+stepName+'\')');

        });

        return function(scope){
            var template = elem.html(),
                wizardScope = scope.$new(),
                CONTROLLER_REGEX = '(\\w*)(\\sas\\s(\\w*))?',
                controllerNameMatch = attr.ngController.match(CONTROLLER_REGEX),
                controllerName = controllerNameMatch[1],
                controllerAsName = controllerNameMatch[3],
                wizardControls = {
                    next : next,
                    previous : previous,
                    goto : goto
                };

            elem.html('');
            elem.append($compile(template)(wizardScope));

            wizardScope[controllerAsName] = $controller(controllerName, {$scope:wizardScope, wizard:wizardControls});

            scope.isActiveStep = function(stepName){
                return stepName === activeStepName;
            }

            function next() {
                var currentStepIndex = stepNames.indexOf(activeStepName);
                if (currentStepIndex + 1 < stepNames.length) {
                    activeStepName = stepNames[currentStepIndex + 1];
                }
            }

            function previous(){
                var currentStepIndex = stepNames.indexOf(activeStepName);
                if (currentStepIndex > 0) {
                    activeStepName = stepNames[currentStepIndex - 1];
                }
            }

            function goto(stepName) {
                console.log(stepName, stepNames.indexOf(stepName))
                if (stepNames.indexOf(stepName) > -1) {
                    activeStepName = stepName;
                }
            }
        }
    }
});