.controller('HomeCtrl', function($scope, $state, Background, Floor, $timeout) {
  var w = document.body.clientWidth;
  var h = document.body.clientHeight;

  LInit(requestAnimationFrame, 'homeCanvas', w, h, main);

  var backgroundLayer, background, stageLayer;
  $scope.stop = false;
  var STAGE_STEP = 1;
  var stageSpeed = 0;
  var imglist = {};
  var imgData = [{
    name: 'back',
    path: 'img/back.png'
  }, {
    name: 'floor0',
    path: 'img/floor0.png'
  }];


  function main(event) {
    initBackgroundLayer();
    LLoadManage.load(
      imgData,
      function(progress) {},
      gameInit
    );
  }

  function gameInit(result) {
    // 取得图片读取结果
    imglist = result;
    gameStart();
  }

  function gameStart() {
    background = new Background(imglist['back'], STAGE_STEP);
    backgroundLayer.addChild(background);

    stageInit();
    backgroundLayer.addEventListener(LEvent.ENTER_FRAME, onframe);
  }

  function onframe() {
    if (!$scope.stop) {
      background.run();
      if (stageSpeed-- < 0) {
        stageSpeed = 100;
        addStage();
      }
      var key = null;
      for (key in stageLayer.childList) {
        var _child = stageLayer.childList[key];
        _child.onframe();
      }
    }
  }

  function stageInit() {
    stageLayer = new LSprite();
    backgroundLayer.addChild(stageLayer);
  }

  function addStage() {
    var mstage;
    mstage = new Floor(imglist['floor0'], STAGE_STEP);
    mstage.y = 580;
    mstage.x = Math.random() * 280;
    stageLayer.addChild(mstage);
  }

  $timeout(function() {
    $scope.stop = true;
  }, 5000)

  $scope.restart = function() {
    $scope.stop = false;
    $timeout(function() {
      $scope.stop = true;
    }, 5000)
  }


  function initBackgroundLayer() {
    backgroundLayer = new LSprite();
    addChild(backgroundLayer);
  }


})