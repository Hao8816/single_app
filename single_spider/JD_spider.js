var http = require('http');
var redis = require('redis');
var client = redis.createClient();
// 解决nodejs不支持gbk编码的问题
var iconv = require('iconv-lite');

// 请求Tmall的首页，爬取手机分类

http.get('http://www.jd.com/allSort.aspx',function(res){
    res.on('data',function(data){
        var encoding = res.headers['content-type'];
        getJDData(data,encoding);
    }).on('error',function(err){
        console.error('can not get response from tmall');
    })
}).on('error',function(e){
    console.error('can not request tmall');
});


function getJDData(data,encoding){
    var env = require('jsdom').env;
    var decode_string = iconv.decode(data,'GB2312');
    // 设置html环境
    env(decode_string.toString(), function (errors, window) {
        try{
            var $ = require('jquery')(window);
            var item_list = $('.m');
            var item_data = {};
            var title_data = {};
            var title_link_list = [];
            console.log(item_list.length)
            for(var i=0;i<item_list.length;i++){
                var sub_titles = $(item_list[i]).find('.mc').find('dl');
                var title_1 = $(item_list[i]).find('.mt a').text();
                var title_1_link = $(item_list[i]).find('.mt a').attr('href');
                title_link_list.push(title_1_link);
                var sub_title_data={};
                for(var j = 0;j<sub_titles.length;j++){
                    var sub_title = $(sub_titles[j]).find('dt').text();
                    var sub_link_list = $(sub_titles[j]).find('dd').find('em');
                    var sub_link_text_list=[];
                    for(var k=0;k<sub_link_list.length;k++){
                        var text = $(sub_link_list[k]).find('a').text();
                        var text_2_link = $(sub_link_list[k]).find('a').attr('href');
                        title_link_list.push(text_2_link);
                        sub_link_text_list.push(text);
                    }
                    sub_title_data[sub_title] = sub_link_text_list;
                }
                title_data[title_1] = sub_title_data;
            }
            if ($.isEmptyObject(title_data)){
                return;
            }
            console.log(title_data);
            console.log(title_link_list);
            // 将 URL链接存储到 redis 里面
            cache_JD_URL(title_link_list);

        } catch(e) {
            console.log(e);
        }
    });
}


//存储首页爬虫爬取的所有url
function cache_JD_URL(url_list){
    //
    url_list.forEach(function(obj){
        client.lpush('JD_URL_LIST',obj,function(err){console.log(err)});
    })
}
