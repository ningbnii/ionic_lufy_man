angular.module('starter.controllers', [])

  .controller('IndexCtrl', function($scope, $state, $ionicModal) {
    // 开始游戏
    $scope.start = function() {
      $state.go('main')
    }
  })
