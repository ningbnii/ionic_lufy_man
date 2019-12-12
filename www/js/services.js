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
    var clientHeight = document.body.clientHeight;
    var clientWidth = document.body.clientWidth;

    // 移动速度
    self.STAGE_STEP = STAGE_STEP;
    self.bitmapData = new LBitmapData(img);
    self.imgHeight = self.bitmapData.height;
    self.imgWidth = self.bitmapData.width;

    // 根据屏幕分辨率和图片大小，计算一下需要多少个图片能够铺满整个屏幕
    // 横向需要几个
    self.xNum = Math.ceil(clientWidth / self.imgWidth);
    // 纵向需要几个
    self.yNum = Math.ceil(clientHeight / self.imgHeight) + 1;
    // 保存横向的bitmap
    self.bitmapArr = [];

    for (var i = 0; i < self.yNum; i++) {
      for (var j = 0; j < self.xNum; j++) {
        var bitmap = new LBitmap(self.bitmapData);
        bitmap.y = self.imgHeight * i;
        bitmap.x = self.imgWidth * j;
        self.addChild(bitmap);
        self.bitmapArr.push(bitmap)
      }
    }

  }
  Background.prototype.run = function() {
    var self = this;
    // 移动背景
    for (var i = 0; i < self.bitmapArr.length; i++) {
      self.bitmapArr[i].y -= self.STAGE_STEP;
    }
    // 当第一个移出外面，并且超过一个图片高度的时候，将所有图片y重置
    if (self.bitmapArr[0].y < -self.imgHeight) {
      for (var i = 0; i < self.bitmapArr.length; i++) {
        self.bitmapArr[i].y += self.imgHeight;
      }
    }
  };

  return Background;
})