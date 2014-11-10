$(function(){
   // init headroom
   $("header").headroom();
   $('#myTab a:first').tab('show')

   //check ajax request
    $.post('/ajax/start/',{'name':'chenhao'},function(data){
        console.log(data);
    },'json');
});


function ShowGoodsCtrl($scope,$http){
    $http.post('/ajax/get_good_list/').success(function(data){
        if(data['ret'] == '0001'){
            console.log(data);
            $scope.goods=data['goods']
        }else{

        }
    });

    $scope.showGoodsInfo = function(goods_info){
        // 由于api暂时只支持字符串，所以用JSON序列化成字符串
        sessionStorage.setItem('latest_visited',JSON.stringify(goods_info));
        location.href='/single/goods/?id='+goods_info.sha1;
        console.log(goods_info)
    }
}

function showGoodsInfoCtrl($scope){
    var goods_info = $('meta[name="single-goods-info"]').attr('content');
    console.log(goods_info)
    //console.log(goods);

}


/*var SingleGoodsService = angular.module('SingleGoods',[]);

function showSingleGoodsInfo($routeProvider){
    $routeProvider.
        when('/goods_info/',{
          controller:'',
          templateUrl:'single_web_goods.html'
        }).
        when('/goods/:id',{
          controller:'',
          templateUrl:'single_web_goods.html'
        }).
        otherwise({
           redirectTo:'/'
        });
}

SingleGoodsService.config(showSingleGoodsIngo);*/