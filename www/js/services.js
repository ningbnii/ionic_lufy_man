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

.factory('Background', function($http, apiUrl, $rootScope, $localstorage) {
  function Background(img, STAGE_STEP) {
    base(this, LSprite, []);
    var self = this;
    self.STAGE_STEP = STAGE_STEP;
    self.bitmapData = new LBitmapData(img);
    self.bitmap1 = new LBitmap(self.bitmapData);
    self.addChild(self.bitmap1);
    self.bitmap2 = new LBitmap(self.bitmapData);
    self.bitmap2.y = self.bitmap1.getHeight();
    self.addChild(self.bitmap2);
    self.bitmap3 = new LBitmap(self.bitmapData);
    self.bitmap3.y = self.bitmap1.getHeight() * 2;
    self.addChild(self.bitmap3);
    self.bitmap4 = new LBitmap(self.bitmapData);
    self.bitmap4.y = self.bitmap1.getHeight * 3;
    self.addChild(self.bitmap4);
  }
  Background.prototype = {
    run: function() {
      var self = this;
      self.bitmap1.y -= self.STAGE_STEP;
      self.bitmap2.y -= self.STAGE_STEP;
      self.bitmap3.y -= self.STAGE_STEP;
      self.bitmap4.y -= self.STAGE_STEP;
      if (self.bitmap1.y < -self.bitmap1.getHeight()) {
        self.bitmap1.y = self.bitmap2.y;
        self.bitmap2.y = self.bitmap1.y + self.bitmap1.getHeight();
        self.bitmap3.y = self.bitmap1.y + self.bitmap1.getHeight() * 2;
        self.bitmap4.y = self.bitmap1.y + self.bitmap1.getHeight() * 3;
      }
    }
  };

  return Background;
})
