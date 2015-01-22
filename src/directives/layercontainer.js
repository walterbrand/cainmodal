/**
 * @ngdoc directive
 * @name senses.runtime.shell.directive:rsLayerContainer
 * @restrict E
 *
 * @description
 * This is the layer directive. Adding this directive to the shell markup registers it with the layer manager and makes
 * it available for feature developers to request slides to be opened under the name given.
 *
 * @param {string} name This is the name used to register the layer with the manager service.
 */
angular.module('app')
    .directive('layerContainer', ['$interpolate', '$compile', '$q', '$templateCache', '$controller', 'layermanager',
        function ($interpolate, $compile, $q, $templateCache, $controller, layerManager) {
            'use strict';

            function LayerContainer($scope, $element) {
                var unregister, slides = new SlidesCollection();

                function enforceConfig($scope) {
                    enforceScopeHasAName($scope);
                }

                function enforceScopeHasAName($scope) {
                    if (!$scope.name) {
                        //logger.error('The \'rs-layer-container\' tag requires a name. Please specify a name for this tag.');
                    }
                }

                function registerLayer() {
                    unregister = layerManager.register($scope.name, slideOpen, hasSlide);
                }

                function slideOpen(configuration) {
                    var slideTemplate = renderSlide(configuration),
                        slideConfig = createSlideConfig(configuration),
                        compiledSlide = $compile(slideTemplate)(slideConfig.scope);

                    enrichSlideController(compiledSlide, slideConfig.deferred);
                    slides.add(compiledSlide);
                    prependSlide(compiledSlide);

                    slideConfig.deferred.promise.finally(function () {
                        destroySlide(compiledSlide);
                    });

                    return slideConfig.deferred.promise;
                }

                function createSlideConfig(configuration) {
                    var slideScope = $scope.$new(), deferred = $q.defer();
                    slideScope.data = configuration.data;
                    slideScope.data.isOpen = false;
                    return {
                        scope: slideScope,
                        deferred: deferred
                    };
                }

                function enrichSlideController(slide, deferred) {
                    slide.controller().inModal = true;
                    slide.controller().resolve = deferred.resolve;
                    slide.controller().reject = deferred.reject;
                }

                function prependSlide(slide) {
                    getPrimaryElement().after(slide);
                }

                function getPrimaryElement() {
                    return angular.element($element.find('div')[0]);
                }

                function renderSlide(configuration) {
                    var templateWrapper = $interpolate('<div class="rs-modalslide" ng-class="{\'rs-modalslide--open\': data.isOpen}" ng-controller="{{controller}}">{{template}}</div>');

                    return templateWrapper({
                        template: configuration.template || $templateCache.get(configuration.templateUrl),
                        controller: configuration.controller
                    });
                }

                function destroySlide(slide) {
                    slides.remove(slide);
                    slide.remove();
                    slide.scope.$destroy();
                }

                function init() {
                    enforceConfig($scope);
                    registerLayer();
                }

                function hasSlide() {
                    return slides.getActive() ? true : false;
                }

                return {
                    init: init,
                    hasSlide: hasSlide,
                    getSlide: slides.getActive
                };
            }

            function SlidesCollection() {
                var collection = [], activeSlide;

                function add(slide) {
                    collection.push(slide);
                    setActive(slide);
                }

                function remove(slide) {
                    var currentSlide = getActive(),
                        activeSlide = (slide !== currentSlide) ? currentSlide : getNextInLine();
                    collection.splice(collection.indexOf(slide), 1);
                    setActive(activeSlide);
                }

                function getNext() {
                    return collection[activeSlide + 1];
                }

                function getPrevious() {
                    return collection[activeSlide - 1];
                }

                function getNextInLine() {
                    return getPrevious() || getNext();
                }

                function getActive() {
                    return collection[activeSlide];
                }

                function setActive(slide) {
                    var active = getActive();
                    if (active) {
                        active.scope().data.isOpen = false;
                    }
                    if (slide) {
                        slide.scope().data.isOpen = true;
                    }
                    activeSlide = collection.indexOf(slide);
                }

                return {
                    add: add,
                    remove: remove,
                    getPrevious: getPrevious,
                    getNext: getNext,
                    getActive: getActive,
                    setActive: setActive
                };
            }

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    name: '@'
                },
                template: '<div class="rs-modallayer" ng-class="{\'rs-modallayer--open\': instance.hasSlide()}"><div ng-transclude></div></div>',
                link: function ($scope, $element) {
                    $scope.instance =
                        new LayerContainer($scope, $element);
                    $scope.instance.init();
                }
            };
        }]);