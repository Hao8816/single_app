var http = require('http');
// 解决nodejs不支持gbk编码的问题
var iconv = require('iconv-lite');

// 请求Tmall的首页，爬取手机分类

http.get('http://list.tmall.com//search_product.htm?spm=141.3067357.1.13.ISi1xo&auction_tag=7809&search_condition=48&cat=50024400&q=%BA%CF%D4%BC%BB%FA&sort=s&style=g&vmarket=0&from=sn_1_prop#J_crumbs',function(res){
    res.on('data',function(data){
        console.log(res.charset);
        var encoding = res.headers['content-type'];
        getTmallData(data,encoding);
    }).on('error',function(err){
        console.error('can not get response from tmall');
    })
}).on('error',function(e){
    console.error('can not request tmall');
});


function getTmallData(data,encoding){
    //console.log(data.toString('gb2312'));
    console.log(encoding);
    var charset = 'utf8';
    if (encoding.indexOf('charset')>0){
        //charset = encoding.search
    }
    var decode_string = iconv.decode(data,'GBK');
    console.log(decode_string)
    var env = require('jsdom').env;
    // 设置html环境
    env(decode_string.toString(), function (errors, window) {
        var $ = require('jquery')(window);

        var text_list = $('.category-menu-nav').find('.menu-nav').text();
        console.log(text_list)
       // console.log($('.category-menu-nav').find('.menu-nav').text());
    });

}