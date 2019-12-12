.controller('HomeCtrl', function($scope, $state, Background, $timeout) {
  var w = document.body.clientWidth;
  var h = document.body.clientHeight;

  LInit(requestAnimationFrame, 'homeCanvas', w, h, main);

  var backgroundLayer, background;
  $scope.stop = false;
  var STAGE_STEP = 1;
  var imglist = {};
  var imgData = [{
    name: 'back',
    path: 'img/back.png'
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


    backgroundLayer.addEventListener(LEvent.ENTER_FRAME, onframe);
  }

  function onframe() {
    if (!$scope.stop) {
      background.run();
    }
  }

  $timeout(function() {
    $scope.stop = true;
  }, 2000)

  $scope.restart = function() {
    $scope.stop = false;
    $timeout(function() {
      $scope.stop = true;
    }, 2000)
  }


  function initBackgroundLayer() {
    backgroundLayer = new LSprite();
    addChild(backgroundLayer);
  }


})