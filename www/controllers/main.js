.
controller('HomeCtrl', function ($scope, $state, $timeout) {
	var w = document.body.clientWidth;
	var h = document.body.clientHeight;
	
	LInit(requestAnimationFrame, 'homeCanvas', w, h, main);
	
	var backgroundLayer, background, stageLayer;
	var hero;
	$scope.stop = false;
	$scope.STAGE_STEP = 1;
	// 刚开始先在页面上铺上一些地板，记录最后一个地板的y值，循环添加的时候，从这个值开始
	$scope.initStageLastY = 0;
	$scope.MOVE_STEP = 2;
	$scope.g = 0.1;
	$scope.stageSpace = 100;
	$scope.imglist = {};
	$scope.imgData = [{
		name: 'back',
		path: 'img/back.png'
	}, {
		name: 'floor0',
		path: 'img/floor0.png'
	},{
		name: 'floor1',
		path: 'img/floor1.png'
	}, {
		name: 'floor2',
		path: 'img/floor3.png'
	},{
		name: 'floor3',
		path: 'img/floor2.png'
	},{
		name: 'wheel',
		path: 'img/wheel.png'
	}, {
		name: 'hero',
		path: 'img/hero.png'
	}];
	
	
	function main(event) {
		initBackgroundLayer();
		LLoadManage.load(
			$scope.imgData,
			function (progress) {
			},
			gameInit
		);
	}
	
	function gameInit(result) {
		// 取得图片读取结果
		$scope.imglist = result;
		gameStart();
	}
	
	function gameStart() {
		// 添加背景
		background = new Background($scope.imglist['back'], $scope.STAGE_STEP);
		backgroundLayer.addChild(background);
		
		// 添加英雄
		hero = new Chara($scope.imglist['hero'], $scope.g, $scope.MOVE_STEP);
		hero.x = w / 2 - hero.getWidth() / 2;
		hero.y = 0;
		hero.hp = hero.maxHp;
		backgroundLayer.addChild(hero);
		
		stageInit();
		backgroundLayer.addEventListener(LEvent.ENTER_FRAME, onframe);
		// backgroundLayer.addEventListener(LMouseEvent.MOUSE_DOWN, mousedown);
		// backgroundLayer.addEventListener(LMouseEvent.MOUSE_UP, mouseup);
		// // pc端通过键盘控制移动
		//
		// if (!LGlobal.canTouch) {
		//
		// 	LEvent.addEventListener(window, LKeyboardEvent.KEY_DOWN, down);
		// 	LEvent.addEventListener(window, LKeyboardEvent.KEY_UP, up);
		// }
		
	}
	
	/**
	 * 监听键盘抬起
	 */
	function up(event) {
		hero.moveType = null;
		hero.changeAction();
	}
	
	/**
	 * 监听键盘按下
	 * @param event
	 */
	function down(event) {
		if (hero.moveType) return;
		if (event.keyCode === 37) {
			hero.moveType = 'left';
		} else if (event.keyCode === 39) {
			hero.moveType = 'right';
		}
		hero.changeAction();
	}
	
	function mouseup(event) {
		if (!hero) return;
		hero.moveType = null;
		hero.changeAction();
	}
	
	function mousedown(event) {
		if (event.offsetX <= 0.5 * w) {
			hero.moveType = 'left';
		} else {
			hero.moveType = 'right';
		}
		hero.changeAction();
	}
	
	/**
	 * 左移动
	 */
	$scope.moveLeft = function () {
		hero.moveType = 'left';
		hero.changeAction();
	};
	
	$scope.moveRight = function () {
		hero.moveType = 'right';
		hero.changeAction();
	};
	
	$scope.moveStop = function () {
		hero.moveType = null;
		hero.changeAction();
	}
	
	function onframe() {
		if (!$scope.stop) {
			background.run();
			// stageSpeed控制添加地板的快慢，值越小，添加越快
			if (background.moveY % $scope.stageSpace === 0) {
				addStage();
			}
			var key = null;
			// found表示主角是否落到了地板上，默认设置为false，也就是处于跳跃状态
			var found = false;
			hero.isJump = true;
			for (key in stageLayer.childList) {
				var _child = stageLayer.childList[key];
				// 当地板移出屏幕之外的时候，移除
				if (_child.y < -_child.getHeight()) {
					stageLayer.removeChild(_child)
				}
				// 碰撞检测
				if (!found && hero.x + 30 >= _child.x && hero.x <= _child.x + 90 && hero.y + 50 >= _child.y + _child.hy && hero._charaOld + 50 <= _child.y + _child.hy + 1) {
					hero.isJump = false;
					hero.changeAction();
					_child.child = hero;
					hero.speed = 0;
					hero.y = _child.y - 49 + _child.hy;
					_child.hitRun();
					found = true;
				} else {
					_child.child = null;
				}
				_child.onframe();
			}
			// 当英雄处于跳跃状态，设置动画状态为跳跃
			if (hero.isJump) {
				hero.anime.setAction(1, 0)
			}
			if (hero) {
				hero.onframe();
				if(hero.hp<=0){
					gameOver();
				}
			}
			
		}
	}
	
	/**
	 * 初始化地板
	 */
	function stageInit() {
		stageLayer = new LSprite();
		backgroundLayer.addChild(stageLayer);
		addStage(w / 2 - 50, h / 3);
		for (var i = h / 3 + $scope.stageSpace; i < h + $scope.stageSpace; i += $scope.stageSpace) {
			addStage(Math.random() * (w - 100), i);
		}
		$scope.initStageLastY = i - $scope.stageSpace;
	}
	
	function addStage(x, y) {
		var mstage;
		var index = Math.random()* 6;
		if(index<1){
			mstage = new Floor01($scope.imglist['floor0'], $scope.STAGE_STEP);
		}else if(index < 2){
			mstage = new Floor02($scope.imglist['floor1'], $scope.STAGE_STEP);
		}else if(index < 3){
			mstage = new Floor03($scope.imglist['floor2'], $scope.STAGE_STEP);
		}else if(index < 4){
			mstage = new Floor04($scope.imglist['floor3'],$scope.STAGE_STEP);
		}else if(index < 5){
			mstage = new Floor05($scope.imglist['wheel'],$scope.STAGE_STEP,$scope.MOVE_STEP);
		}else if(index < 6){
			mstage = new Floor06($scope.imglist['wheel'],$scope.STAGE_STEP,$scope.MOVE_STEP);
		}
		
		mstage.y = y ? y : $scope.initStageLastY;
		mstage.x = x ? x : Math.random() * (w - 100);
		stageLayer.addChild(mstage);
	}
	
	/**
	 * 游戏结束
	 */
	function gameOver(){
		$scope.stop = true;
	}
	
	$scope.restart = function () {
		backgroundLayer.removeAllChild();
		backgroundLayer.removeAllEventListener();
		gameStart();
		$scope.stop = false;
	};
	
	
	function initBackgroundLayer() {
		backgroundLayer = new LSprite();
		// backgroundLayer.graphics.drawRect(0,'#000',[0,0,w,h],true,'#000');
		addChild(backgroundLayer);
	}
	
	$scope.$on('$ionicView.leave', function () {
		backgroundLayer.removeAllChild();
		backgroundLayer.removeAllEventListener();
	})
	
})
