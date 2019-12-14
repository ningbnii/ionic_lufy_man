.factory('Floor', function($http, apiUrl, $rootScope, $localstorage) {
  function Floor(img, STAGE_STEP) {
    base(this, LSprite, []);
    var self = this;
    self.hy = 0;
    self.STAGE_STEP = STAGE_STEP;
    self.img = img;
    self.setView();
  }

  Floor.prototype.setView = function() {
    var self = this;
    self.bitmap = new LBitmap(new LBitmapData(self.img));
    self.addChild(self.bitmap);
  }

  Floor.prototype.onframe = function() {
    var self = this;
    self.y -= self.STAGE_STEP;
  }

  Floor.prototype.hitRun = function() {}


  return Floor;
})