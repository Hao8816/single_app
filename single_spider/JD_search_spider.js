// 定义搜索的一些关键词

var search_key_words = ['手机','电脑'];

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


// 获取导航里面的分类信息
http.get('http://detail.zol.com.cn/xhr_Header_Default_subcateId=57%5EmanuId=0%5EpageType=List.html',function(res){
    res.on('data',function(data){
        getZOLNavData(data);
    }).on('error',function(err){
        console.log(err)
    })
});

function getZOLNavData(data) {
    //var decode_string = iconv.decode(data, 'GBK');
    var decode_string = data;
    var env = require('jsdom').env;
    // 设置html环境
    env(decode_string.toString(), function (errors, window) {
        var $ = require('jquery')(window);
        var nav_title_list = $('#head_pub_nav').find('.onav');
        var nav_data = {};
        for (var i = 0; i < nav_title_list.length; i++) {
            var title = $(nav_title_list[i]).find('span a').text();
            var sub_title_list = $(nav_title_list[i]).find('.sub_nav dd a');
            var sub_titles = [];
            for (var j = 0; j < sub_title_list.length; j++) {
                var title_text = $(sub_title_list[j]).text();
                sub_titles.push(title_text);
            }
            nav_data[title] = sub_titles;
        }
        console.log(nav_data);

    });
}

