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

/**
 * 英雄
 * @param img 英雄序列图片
 * @param g 加速度
 * @param MOVE_STEP 英雄移动速度
 * @constructor
 */
function Chara(img, g, MOVE_STEP) {
	base(this, LSprite, []);
	var self = this;
	// 控制英雄是左移还是右移
	self.moveType = null;
	// 当前血量
	self.hp = 3;
	// 最大血量
	self.maxHp = 3;
	// 当主角血量降低后，用来控制血量的恢复速度
	self.hpCtrl = 0;
	// 是否处于跳跃状态
	self.isJump = true;
	// 控制主角动作变换的快慢
	self.index = 0;
	// 主角下落的速度
	self.speed = 0;
	// 主角每次下落前的y坐标
	self._charaOld = 0;
    // 加速度，改变下落速度
	self.g = g;
	self.MOVE_STEP = MOVE_STEP;
	self.clientHeight = document.body.clientHeight;
	self.clientWidth = document.body.clientWidth;
	// 切割图片，取得游戏主角每个动作图片的坐标
	var list = LGlobal.divideCoordinate(960, 50, 1, 24);
	var data = new LBitmapData(img, 0, 0, 40, 50);
	self.anime = new LAnimation(self, data, [
		[list[0][0]], // 站立
		[list[0][1]], // 跳跃
		[list[0][2], list[0][3], list[0][4], list[0][5], list[0][6], list[0][7], list[0][8], list[0][9], list[0][10], list[0][11], list[0][12]], // 右移
		[list[0][13], list[0][14], list[0][15], list[0][16], list[0][17], list[0][18], list[0][19], list[0][20], list[0][21], list[0][22], list[0][23]] // 左移
	]);

}

/**
 * onframe在游戏每次循环的时候都会被调用
 */
Chara.prototype.onframe = function () {
	var self = this;
	// 记录主角的y坐标，
	self._charaOld = self.y;
	// 下落
	self.y += self.speed;

	self.speed += self.g;
	// 当下落速度大于20的时候，不再增大，防止速度太快，和地板碰撞检测的时候有问题
	if (self.speed > 20) self.speed = 20;
	// 当主角落到屏幕外面的时候，将血量置为0
	if (self.y > self.clientHeight) {
		self.hp = 0;
	}
	// 控制主角移动
	if (self.moveType == 'left') {
		self.x -= self.MOVE_STEP;
	} else if (self.moveType == 'right') {
		self.x += self.MOVE_STEP;
	}
	// 防止主角在横向移出屏幕外面，动作图标的宽度为50，左右两边分别留了10的空白，小人的宽度是30
    // 如果在设计图标的时候，两边设计的没有预留空白会比较好
	if (self.x < -10) {
		self.x = -10;
	} else if (self.x > self.clientWidth - 30) {
		self.x = self.clientWidth - 30;
	}
	// index控制主角动作切换的快慢，index越大，切换越慢
	if (self.index-- > 0) {
		return;
	}
	self.index = 10;
	self.anime.onframe();
};

/**
 * 切换主角动作
 */
Chara.prototype.changeAction = function () {
	var self = this;
	if (self.moveType == 'left') {
		self.anime.setAction(3);
	} else if (self.moveType == 'right') {
		self.anime.setAction(2);
	} else if (self.isJump) {
		self.anime.setAction(1, 0);
	} else {
		self.anime.setAction(0, 0);
	}
}

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



