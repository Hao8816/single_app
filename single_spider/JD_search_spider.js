// 定义搜索的一些关键词

var search_key_words = ['手机','电脑'];
var JD_download = require('./JD_image_spider');
var http = require('http');
var redis = require('redis');
var client =  redis.createClient();
// 解决nodejs不支持gbk编码的问题
var iconv = require('iconv-lite');

// 请求Tmall的首页，爬取手机分类
var url_list = [];
// 构造搜索爬虫的url
for (var i=0;i<search_key_words.length;i++){
    //var url_encode_string = encodeURIComponent(search_key_words[i]);
    url_list.push('http://search.jd.com/Search?keyword='+search_key_words[i]+'&enc=utf-8');
    console.log(url_list);
}



// 定义buffer对象来存储返回的数据

var buffer_list = [];

http.get('http://list.jd.com/list.html?cat=9987,653,655',function(res){
    res.on('data',function(data){
        buffer_list.push(data);
        console.log(data);
    }).on('end',function(){
        var new_buffer = Buffer.concat(buffer_list);
        getJDGoodsData(new_buffer);
        console.log('success')
    }).on('error',function(err){
        console.error('can not get response from JD');
    })
}).on('error',function(e){
    console.error('can not request JD');
});


// 循环url 取得页面data
/*for (var j=0;j<url_list.length;j++){
    console.log(url_list[j]);
    http.get(url_list[j],function(res){
        res.on('data',function(data){
            getJDGoodsData(data);
            console.log(data);
        }).on('end',function(){
            console.log('success')

        }).on('error',function(err){
            console.error('can not get response from JD');
        })
    }).on('error',function(e){
        console.error('can not request JD');
    });
}*/


function getJDGoodsData(data) {
    //var decode_string = iconv.decode(data, 'GBK');
    var decode_string = data;
    console.log(data.toString())
    var env = require('jsdom').env;
    // 设置html环境
    env(decode_string.toString(), function (errors, window) {
        var $ = require('jquery')(window);
        var goods_list = $('.list-h').find('li .lh-wrap');
        console.log(goods_list.length);
        var image_url_list = [];
        for (var i = 0; i < goods_list.length; i++) {
            var url = $(goods_list[i]).find('.p-img img').attr('data-lazyload');
            image_url_list.push(url);
        }
        console.log(image_url_list);
        cacheJDImageList(image_url_list);

    });
}

function cacheJDImageList(url_list){
    url_list.forEach(function(obj){
        JD_download.JD_image_download(obj);
        client.lpush('JD_GOODS_IMAGE_LIST',obj,function(err){
            if(err){
                console.log(err);
            }
        })
    })

}
