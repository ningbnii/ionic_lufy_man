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
	}else if(self.y<10){
		// 碰到了顶部的刺
		self.hp --;
		self.y += 20;
		// 如果正在弹簧地板上，可能正在向上运动，速度为负数，将速度设置为0，以免重复减血
		if(self.speed<0){
			self.speed = 0;
		}
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
