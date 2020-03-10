/**
 * 地板，主角站在地板上，根据地板种类不同，可能站在中间
 * @param img 地板图片
 * @param STAGE_STEP 地板移动速度
 * @constructor
 */
function Floor(img, STAGE_STEP,MOVE_STEP) {
	base(this, LSprite, []);
	var self = this;
	// 控制主角和地板的相对位置
	self.hy = 0;
	// 地板向上移动的速度，和背景速度相同
	self.STAGE_STEP = STAGE_STEP;
	self.MOVE_STEP = MOVE_STEP;
	self.img = img;
	self.setView();
}

/**
 * 设置地板的皮肤
 */
Floor.prototype.setView = function() {};

/**
 * 地板移动
 */
Floor.prototype.onframe = function() {
	var self = this;
	self.y -= self.STAGE_STEP;
	// 当主角落在地板上的时候，让他和地板一块移动
	if (self.child) {
		self.child.y -= self.STAGE_STEP;
	}
};

Floor.prototype.hitRun = function() {};

function Floor01() {
	base(this, Floor, arguments);
}

Floor01.prototype.setView = function() {
	var self = this;
	self.bitmap = new LBitmap(new LBitmapData(self.img));
	self.addChild(self.bitmap)
}

// 会消失的地板
function Floor02() {
	base(this,Floor,arguments);
	var self = this;
	self.ctrlIndex = 0;
}

Floor02.prototype.setView = function () {
	var self = this;
	self.bitmap = new LBitmap(new LBitmapData(self.img,0,0,100,20));
	self.addChild(self.bitmap);
}

Floor02.prototype.hitRun = function () {
	var self = this;
	self.callParent('hitRun',arguments);
	self.ctrlIndex ++;
	if(self.ctrlIndex === 20){
		// setCoordinate改变图片显示区域的起点坐标
		self.bitmap.bitmapData.setCoordinate(100,0);
	}else if(self.ctrlIndex >= 40){
		self.parent.removeChild(this);
	}
};

/**
 * 带刺的地板
 */
function Floor03() {
	base(this,Floor,arguments);
	var self = this;
	// 只掉一次血
	self.hit = false;
	// 站在地板中央
	self.hy = 10;
}

Floor03.prototype.setView = function () {
	var self = this;
	self.bitmap = new LBitmap(new LBitmapData(self.img));
	self.addChild(self.bitmap);
};

Floor03.prototype.hitRun = function () {
	var self = this;
	self.callParent('hitRun',arguments);
	if(!self.hit){
		self.hit = true;
		self.child.hp -=1;
	}
};

/**
 * 有弹性的地板
 * @constructor
 */
function Floor04() {
	base(this,Floor,arguments);
	var self = this;
	self.ctrlIndex = 0;
	self.hy = 8;
}

Floor04.prototype.setView = function () {
	var self = this;
	self.bitmap = new LBitmap(new LBitmapData(self.img,0,0,100,20));
	self.addChild(self.bitmap)
};

Floor04.prototype.hitRun = function () {
	var self = this;
	self.callParent('hitRun',arguments);
	// 控制地板回弹
	self.ctrlIndex = 0;
	// 改变主角的y坐标，将主角移动到地板之外
	self.child.y -= self.hy;
	// 将主角的速度设置为-4，速度为负数的时候表示向上跳跃
	self.child.speed = -4;
	// 设置为跳跃状态
	self.child.isJump = true;
	// 将主角从地板上移除
	self.child = null;
	// 改变地板状态
	self.bitmap.bitmapData.setCoordinate(100,0);
};

Floor04.prototype.onframe = function () {
	var self = this;
	self.callParent('onframe',arguments);
	self.ctrlIndex ++;
	if(self.ctrlIndex === 20){
		self.bitmap.bitmapData.setCoordinate(0,0);
	}
};

/**
 * 向右移动的地板
 */
function Floor05() {
	base(this,Floor,arguments);
	var self = this;
}

Floor05.prototype.setView = function () {
	var self = this;
	self.graphics.drawRect(1,'#cccccc',[10,2,80,16]);
	self.wheelLeft = new LBitmap(new LBitmapData(self.img));
	self.addChild(self.wheelLeft);
	self.wheelRight = new LBitmap(new LBitmapData(self.img));
	self.addChild(self.wheelRight);
	self.wheelRight.x = 100 - self.wheelRight.getWidth();
};

Floor05.prototype.onframe = function () {
	var self = this;
	self.callParent('onframe',arguments);
	self.wheelLeft.rotate += 2;
	self.wheelRight.rotate += 2;
};

Floor05.prototype.hitRun = function () {
	var self = this;
	self.callParent('hitRun',arguments);
	self.child.x += (self.MOVE_STEP - 1);
};
/**
 * 向左移动的地板
 */
function Floor06() {
	base(this,Floor,arguments);
	var self = this;
}

Floor06.prototype.setView = function () {
	var self = this;
	self.graphics.drawRect(1,'#cccccc',[10,2,80,16]);
	self.wheelLeft = new LBitmap(new LBitmapData(self.img));
	self.addChild(self.wheelLeft);
	self.wheelRight = new LBitmap(new LBitmapData(self.img));
	self.addChild(self.wheelRight);
	self.wheelRight.x = 100 - self.wheelRight.getWidth();
};

Floor06.prototype.onframe = function () {
	var self = this;
	self.callParent('onframe',arguments);
	self.wheelLeft.rotate -= 2;
	self.wheelRight.rotate -= 2;
};

Floor06.prototype.hitRun = function () {
	var self = this;
	self.callParent('hitRun',arguments);
	self.child.x -= (self.MOVE_STEP - 1);
};



