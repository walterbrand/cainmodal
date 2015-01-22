angular.module('app')
    .provider('layermanager', function layerManager() {

        'use strict';

        var layerCache = [];

        function isValidConfiguration(configuration){
            return hasValidTemplate(configuration) ||
                hasController(configuration) ||
                hasValidDataObject(configuration);
        }

        function hasValidTemplate(configuration){
            return hasTemplate(configuration) ||
                templateHasSingleRoot(configuration.template);

        }

        function hasTemplate(configuration) {
            if(!(angular.isDefined(configuration.template) || angular.isDefined(configuration.templateUrl))) {
                return 'Dispatch configuration must define a template or templateUrl.';
            }
        }

        function templateHasSingleRoot(template) {
            if(template === '' || angular.element(template).length > 1) {
                return 'Dispatch configuration template must have exactly one root element.';
            }
        }

        function hasController(configuration) {
            if(!angular.isDefined(configuration.controller)) {
                return 'Dispatch configuration must define a controller.';
            }
        }

        function hasValidDataObject(configuration) {
            return hasDataObject(configuration) ||
                isDataObject(configuration.data);
        }

        function hasDataObject(configuration) {
            if(!angular.isDefined(configuration.data)) {
                return 'Dispatch configuration must define a data object.';
            }
        }

        function isDataObject(data) {
            if((typeof data) !== 'object') {
                return 'Type of data must be an \'object\'.';
            }
        }

        /**
         * @ngdoc service
         * @name senses.runtime.core.layerManager
         * @description configuration options for the layerManager
         */
        this.$get = ['$q', function($q) {

            /**
             * @public
             * @ngdoc method
             * @methodOf senses.runtime.core.layerManager
             * @name isOpen
             * @description
             * Validates whether or not a layer is opened.
             * @param {string} name The name of the layer to check
             * @return {boolean} Whether or not the layer is open.
             */
            function isOpen(name) {
                var open = false;
                layerCache.map(function(layer){
                    if(layer.layerName === name) {
                        open = open || layer.layerHasSlides();
                    }
                });
                return open;
            }

            /**
             * @public
             * @ngdoc method
             * @methodOf senses.runtime.core.layerManager
             * @name dispatch
             * @description
             * Validates the configuration object and when valid calls the dispatch callback for
             * the corresponding layers with the configuration.
             * @param name The name of the layer to dispatch to
             * @param configuration The configuration for the new slide in the requested layer.
             */
            function dispatch(name, configuration) {
                var message, deferred = $q.defer();
                if(!(message = isValidConfiguration(configuration))) {
                    layerCache.map(function(layer){
                        if(layer.layerName === name) {
                            $q.when(layer.layerCallback(configuration)).then(deferred.resolve, deferred.reject);
                        }
                    });
                } else {
                    deferred.reject(message);
                }
                return deferred.promise;
            }

            /**
             * @public
             * @ngdoc method
             * @methodOf senses.runtime.core.layerManager
             * @name register
             * @description
             * Adds the layer to the layer repository with it's corresponding dispatch callback.
             * @param {String} name the name of the layer being registered.
             * @param {function} callback the dispatcher callback for this layer
             * @returns function A unregister callback for this layer.
             */
            function register(name, openSlideCallback, hasSlides) {
                var layerObject = {
                    layerName: name,
                    layerCallback: openSlideCallback,
                    layerHasSlides: hasSlides
                };
                layerCache.push(layerObject);
                return function() {
                    layerCache.splice(layerCache.indexOf(layerObject), 1);
                };
            }

            return {
                dispatch: dispatch,
                register: register,
                isOpen: isOpen
            };
        }];
    });