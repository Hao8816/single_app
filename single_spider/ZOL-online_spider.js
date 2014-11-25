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

http.get('http://detail.zol.com.cn/xhr_Header_WTrendEnter_proIds=p353416-p374241-p385410-p374242-p374499-p369691-p382520-p366588-p390206-p381220-p383462-p388980-p355153-p368904-p366586-p385937-p386683-p314780-p392016-p368216-p362464-p365757-p362774-p374502-p392292%5Ecallback=WtrendCallback.GetFollow.html?_=1416889263826',function(res){
    res.on('data',function(data){
        console.log(data.toString());
    }).on('error',function(err){
        console.log(err)
    })
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
    

        // 获取手机详情的列表
        var product_list = $('.list-box').find('.list-item');
        console.log(product_list.length)
        var product_data_list=[];
        for (var j=0;j<product_list.length;j++){
            var product_info = {};
            var image_url = $(product_list[j]).find('.pic-box').attr('data-rel');
            product_info['image_url'] = image_url;
            product_data_list.push(product_info);
        } 
        console.log(product_data_list)

    
        console.log(data)
        // setDataInRedis(data);
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
