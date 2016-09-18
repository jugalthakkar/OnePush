'use strict';

angular.module('onePush.main', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'main/main.html',
        controller: 'MainCtrl'
    });
}])
.controller('MainCtrl', ['$scope', 'webApi','$timeout', function ($scope, webApi,$timeout) {
    //$('body').bootstrapMaterialDesign({});
    $.material.init();
    $scope.websites = [];
    $scope.loading = true;
    var updatedLikes = function () {
        webApi.getLikedWebsites().then(function (likedWebsites) {
            _.each($scope.websites, function (website) {
                website.liked = _.contains(likedWebsites, website.id);
            });
        });
    };
    $scope.websiteToPush = {/* url: 'http://jug.al', title: 'Jugal Thakkar', tag: 'Personal' */};
    
    
    webApi.fetchWebsites().then(function (websites) {
        $scope.loading = false;
        $scope.websites = websites;
        updatedLikes();
    });
    
    $scope.pushWebsite = function () {
        webApi.pushWebsite($scope.websiteToPush).then(function (message) {
            $scope.message = message;
        }, function (message) {
            $scope.message = message;
        });
    };
    $scope.like = function (id) {
        webApi.likeWebsite(id).then(function () {
            updatedLikes();
        });
    };
    $scope.unlike = function (id) {
        webApi.unlikeWebsite(id).then(function () {
            updatedLikes();
        });
    };
    $scope.setQuery = function(query) {
        $scope.query = query;
    };
    $scope.startSearch = function() {
        $scope.searching = true;
    };
    $scope.stopSearch = function () {
        $timeout(function() {
            $scope.searching = false;
        }, 500);
    };
}]).service('webApi', ['$q', '$http','$timeout', function ($q, $http,$timeout) {
    this.fetchWebsites = function () {
        var deferred = $q.defer();
        /**1/
        $timeout(function() {
            var websites = [{ "id": "1", "title": "daniel g. siegel", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/11.png", "url_address": "http:\/\/www.dgsiegel.net\/", "tag": "personal" }, { "id": "2", "title": "Ross Penman", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/18.png", "url_address": "https:\/\/rosspenman.com\/", "tag": "Personal" }, { "id": "3", "title": "goker \/ resume", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/21.png", "url_address": "http:\/\/gokercebeci.com\/me", "tag": "Blog" }, { "id": "4", "title": "Gilles Quenot \/ SO", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/6.png", "url_address": "https:\/\/goo.gl\/fdr5Kq", "tag": "Social" }, { "id": "5", "title": "Nithin Rao Kumblekar", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/2.png", "url_address": "http:\/\/www.nithinkumblekar.com\/", "tag": "Caricature" }, { "id": "6", "title": "I am ben", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/18.png", "url_address": "http:\/\/www.iamben.co.uk\/", "tag": "Professional" }, { "id": "7", "title": "Mathias Karlsson", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/14.png", "url_address": "https:\/\/bounty.github.com\/researchers\/avlidienbrunn.html", "tag": "Security" }, { "id": "8", "title": "randomstream", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/4.png", "url_address": "http:\/\/kracekumar.com\/", "tag": "personal" }, { "id": "9", "title": "travisneilson", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/39.png", "url_address": "http:\/\/travisneilson.com\/", "tag": "personal" }, { "id": "10", "title": "adhamdannaway", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/24.png", "url_address": "http:\/\/www.adhamdannaway.com\/", "tag": "personal" }, { "id": "38", "title": "wonderland", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/31.png", "url_address": "https:\/\/wonderland.com", "tag": "personal" }, { "id": "26", "title": "chin2km", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/24.png", "url_address": "http:\/\/www.chin2km.com", "tag": "portfolio" }, { "id": "17", "title": "ugph", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/34.png", "url_address": "http:\/\/ugph.in\/", "tag": "psdtohtml" }, { "id": "40", "title": "ffffff", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/24.png", "url_address": "http:\/\/xvh.com", "tag": "dddd" }, { "id": "39", "title": "google", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/43.png", "url_address": ".http:\/\/google.com.", "tag": "engine" }, { "id": "36", "title": "cryptlife", "favicon_image": "http:\/\/hackerearth.0x10.info\/api\/avatar\/17.png", "url_address": "http:\/\/www.cryptlife.com", "tag": "tech" }];
            deferred.resolve(websites);
        },5000);
        
        /**/
        $http.get('https://hackerearth.0x10.info/api/one-push', {
            params: { type: 'json', query: 'list_websites' }
        }).then(function(response) {
            deferred.resolve(response.data.websites);
        }, function(response) {
            deferred.reject(response);
        });
        /**/
        return deferred.promise;

    };
    this.pushWebsite = function (website) {
        var deferred = $q.defer();
        $http.get('https://hackerearth.0x10.info/api/one-push', {
            params: { type: 'json', query: 'push', title: website.title, url: website.url, tag: website.tag }
        }).then(function (response) {
            if (response.data.status == "200") {
                deferred.resolve(response.data.message);
            } else {
                deferred.reject(response.data.message);
            }
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };
    this.getLikedWebsites = function () {
        var deferred = $q.defer();
        if (localStorage) {
            if (localStorage.likedWebsites) {
                //$timeout(function () {
                    deferred.resolve(JSON.parse(localStorage.likedWebsites));
                //}, 0);
            } else {
                var likedWebsites = [];
                localStorage.likedWebsites = JSON.stringify(likedWebsites);
                deferred.resolve(likedWebsites);
            }
        } else {
            deferred.reject([]);
        }
        return deferred.promise;
    };
    this.likeWebsite = function (website) {
        var deferred = $q.defer();
        this.getLikedWebsites().then(function (likedWebsites) {
            likedWebsites.push(website.id);
            localStorage.likedWebsites = JSON.stringify(likedWebsites);
            deferred.resolve(likedWebsites);
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };
    this.unlikeWebsite = function (website) {
        var deferred = $q.defer();
        this.getLikedWebsites().then(function (likedWebsites) {
            likedWebsites = _.without(likedWebsites, website.id);
            localStorage.likedWebsites = JSON.stringify(likedWebsites);
            deferred.resolve(likedWebsites);
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };
}]);