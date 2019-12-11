.controller('MainCtrl', function($scope, $state, Background) {
  var w = document.body.clientWidth;
  var h = document.body.clientHeight;

  LInit(requestAnimationFrame, 'main', w, h, main);

  var backgroundLayer, background;
  var STAGE_STEP = 1;
  var imglist = {};
  var imgData = [
    { name: 'back', path: 'img/back.png' }
  ];


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
    background.run();
  }


  function initBackgroundLayer() {
    backgroundLayer = new LSprite();
    addChild(backgroundLayer);
  }


  $scope.$on('$ionicView.leave', function() {
    backgroundLayer.removeAllChild();
    backgroundLayer.die();
  })

})
