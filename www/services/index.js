angular.module('starter.services', [])
  .constant('apiUrl', 'http://wxapi.chinafhse.com')

  // localstorage
  .factory('$localstorage', ['$window', '$rootScope', function($window, $rootScope) {
    return {
      set: function(key, value) {
        $window.localStorage[key + '_' + $rootScope.openid] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key + '_' + $rootScope.openid] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key + '_' + $rootScope.openid] = JSON.stringify(value);
      },
      getObject: function(key) {
        if ($window.localStorage[key + '_' + $rootScope.openid] === undefined) {
          var result = new Array();
          return result;
        } else {
          return JSON.parse($window.localStorage[key + '_' + $rootScope.openid]);
        }
      },
      del: function(key) {
        return $window.localStorage.removeItem(key + '_' + $rootScope.openid);
      },
      clear: function() {
        return $window.localStorage.clear();
      }
    }
  }])
