/* global angular */
var shopping = angular.module('shopping',['ngCookies']);

shopping.config(function($interpolateProvider) {
    //allow django templates and angular to co-exist
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

shopping.run(function($rootScope, $log, $http, $cookies) {

    $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];

});

shopping.factory('ModelUtils', function($http, $log) {


    var handleErrors =  function(serverResponse, status, errorDestination) {
            if (angular.isDefined(errorDestination)) {
                if (status >= 500) {
                    errorDestination.form = 'Server Error: ' + status;
                } else if (status >= 401) {
                    errorDestination.form = 'Unauthorized Error: ' + status;
                } else {
                    angular.forEach(serverResponse, function(value, key) {
                        if (key != '__all__') {
                            errorDestination[key] = angular.isArray(value) ? value.join("<br/>") : value;
                        } else {
                            errorDestination.form = errorDestination.form || '' + key + ':' + angular.isArray(value) ? value.join("<br/>") : value;
                        }
                    });
                }
            }
        };

    var ModelUtils = {
        get: function(url,id) {
            $http.get(url + id + '/').then(function(response){response.data});
        },
        create: function(url, obj, errors) {
            return $http.post(url, obj).
                success(function(response, status, headers, config) {
                    angular.extend(obj, response);
                }).
                error(function(response, status, headers, config) {
                    handleErrors(response, status, errors);
                });
        },
        save: function(url, obj, errors) {
            if (angular.isDefined(obj.id)) {
                return $http.put(url + obj.id + '/', obj).
                        success(function(response, status, headers, config) {
                            angular.extend(obj, response);
                        }).
                        error(function(response, status, headers, config) {
                            handleErrors(response, status, errors);
                        });
            } else {
                return this.create(url, obj, errors);
            }
        },
        del: function(url, obj) {
            return $http.delete(url + obj.id + '/');
        }
    };
    return ModelUtils;
});


shopping.controller('ListCtrl', function ListCtrl($scope, $log, $http, ModelUtils) {

    // just a dummy init function
    $scope.initialize = function(data) {
        $log.log('initialize',data);
        $scope.initData = data;
    };

    $scope.loadItems = function() {
        $scope.items = $http.get('/api/item/').then(function(response){
            return response.data;
        });
    };

    $scope.loadItems();
    $scope.currentItem = {};
    $scope.errors = {};

    $scope.saveItem = function() {
        ModelUtils.save('/api/item/',$scope.currentItem, $scope.errors).then(function(){
            $scope.loadItems();
            $scope.currentItem = {};
        });
    };

    $scope.delItem = function(item) {
        ModelUtils.del('/api/item/',item).then(function(){
            $scope.loadItems();
        });

    };


});