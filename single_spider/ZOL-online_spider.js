var http = require('http');
var redis = require('redis');
var client =  redis.createClient();
// 解决nodejs不支持gbk编码的问题
var iconv = require('iconv-lite');

// 请求Tmall的首页，爬取手机分类

http.get('http://detail.zol.com.cn/cell_phone_index/subcate57_list_1.html',function(res){
    res.on('data',function(data){
        var encoding = res.headers['content-type'];
        getZOLData(data,encoding);
    }).on('error',function(err){
        console.error('can not get response from tmall');
    })
}).on('error',function(e){
    console.error('can not request tmall');
});


function getZOLData(data,encoding){
    //console.log(data.toString('gb2312'));
    if(data.length == 0){
        return;
    }
    var decode_string = iconv.decode(data,'GBK');
    var env = require('jsdom').env;
    // 设置html环境
    env(decode_string.toString(), function (errors, window) {
        var $ = require('jquery')(window);

        var filter_list = $('.filter-item');
        var data ={};
        // 获取标题分类
        for(var i=0;i<filter_list.length;i++){
            var key = $(filter_list[i]).find('dt').text();
            var value = $(filter_list[i]).find('a');
            var value_list = [];
            for (var j=0;j<value.length;j++){
                var text = $(value[j]).text();
                if(text.length == 0){
                    continue;
                }
                value_list.push(text);
            }
            data[key] = value_list;
        }
        if($.isEmptyObject(data)){
            return;
        }
        setDataInRedis(data);
        // console.log($('.category-menu-nav').find('.menu-nav').text());
    });
}


function setDataInRedis(data){
    for(key in data){
        var value = data[key];
        client.hset('MOBILE_ATTR',key,JSON.stringify(value),function(err,status){
            if(err){
                console.log('set in redis error');
            }
            console.log('success set in redis');
        })
    }
}