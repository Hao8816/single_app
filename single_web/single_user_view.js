/*redis 读取数据的接口*/
var models = require('./single_model');
var redis = require("redis");
var async = require("async")
var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

// 取得用户信息，先从缓存里面取得信息
function readUserFromDatabase(key){
    async.waterfall([
        function(readMysql){
            client.get(key,function(err,value){
                if (err){
                    console.log('Get Value By Key Error'+err);
                }
                readMysql(err,value);
            })
        },
        function readMysql(result,get_result){
            if(result){
                get_result(result);
            }else{
                models.User.find({ name: "chenhao" },function(err,result){
                    if(err){
                        console.log('can not find');
                    }else{
                        get_result(result);
                    }
                })
            }
        }
    ],
    function get_result(result){

        console.log(result);
    });
}


function getValueBykeyFormRedis(key){
    client.get(key,function(err,value){
        if (err){
            console.log('Get Value By Key Error'+err);
        }
        readKeyFromMysql(key,value);
    })
}
function readKeyFromMysql(key,value){
    console.log(key+'--'+value);
    models.User.find({ name: key },function(err,result){
        if(err){
            console.log('can not find');
        }else{
            console.log(result);
        }
    })
}



function writeUserToDatabase(user_obj){


}

exports.readUserFromDatabase = readUserFromDatabase;
exports.getValueBykeyFormRedis = getValueBykeyFormRedis;
