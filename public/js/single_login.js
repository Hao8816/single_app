/*---include single login---*/

$(function(){
    var rsa_public_key=$('meta[name="rsa-public-key"]').attr('content');
})

function LoginCtrl($scope,$http){

    $scope.checkUserName=function(){
        var user=$scope.user;
        var rsa_public_key=$('meta[name="rsa-public-key"]').attr('content');
        var rsa_key = RSA.getPublicKey(rsa_public_key);
        //user.password=RSA.encrypt(user.password,rsa_key);
        user.error=false;
        $http.post('/ajax/check_user_name/',user).success(function(data){
            if(data['ret']=='0001'){
                location.href='/single/index/'
            }else{
                $scope.user.message='请检查用户名或密码输入是否正确！';
                $scope.user.error=true;
            }
        });
    };
}