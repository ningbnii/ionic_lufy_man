/**
 * 背景层
 * @param img 背景图片
 * @param STAGE_STEP 移动速度
 * @constructor
 */
function Background(img, STAGE_STEP) {
	base(this, LSprite, []);
	var self = this;
	var clientHeight = document.body.clientHeight;
	var clientWidth = document.body.clientWidth;
	// y轴移动量
	self.moveY = 0;

	// 移动速度，背景网上滚动
	self.STAGE_STEP = STAGE_STEP;
	// 背景图片
	self.bitmapData = new LBitmapData(img);
	self.imgHeight = self.bitmapData.height;
	self.imgWidth = self.bitmapData.width;

	// 计算铺满整个屏幕，横着需要几个背景图片，竖着需要几个背景图片
	self.xNum = Math.ceil(clientWidth / self.imgWidth);
	// 因为是要往上滚动，所以y方向多放一个，当第一个移出屏幕之外的时候，将所有背景图片y重置，就实现了循环滚动的效果
	self.yNum = Math.ceil(clientHeight / self.imgHeight) + 1;
	// 把所有图片存起来
	self.bitmapArr = [];
	// 铺满整个屏幕
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

/**
 * 屏幕滚动起来
 */
Background.prototype.run = function() {
	var self = this;
	// 移动背景，往上移动，y坐标递减
	self.moveY += self.STAGE_STEP;
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
