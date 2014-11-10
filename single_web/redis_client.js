/*redis 读取数据的接口*/
var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

/*set value by key in redis */
function setValueByKey(key,value,expire){
    client.set(key,value,redis.print);
    if (expire){
        client.expires(key,expire)
    }
}
/*get value by key from redis*/
function getValueByKey(key){
    client.get(key,function(err,value){
        if (err){
            console.log('Get Value By Key Error'+err);
        }
        return value;
    })
}

/*meset key and value */
function msetValuesByKeys(keys,values){
    if (keys.length != values.length){
        console.log('Keys Does Not Match Vaules Error');
        return;
    }
    var key_value_list=[];
    for (var i=0;i<keys.length;i++){
        client.set(keys[i],values[i])
    }
}

/*mget values by keys*/
function mgetValuesByKeys(keys,callback){
    client.mget(keys,function(err,values){
        if (err){
            console.log('Mget Values By Keys Error');
        }
        return callback(values);
    })
}

exports.getValueByKey=getValueByKey;
exports.setValueByKey = setValueByKey;
exports.msetValuesByKeys = msetValuesByKeys;
exports.mgetValuesByKeys = mgetValuesByKeys;


