var http = require('http');

// 请求Tmall的首页，爬取分类

http.get('http://www.tmall.com',function(res){
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
    var env = require('jsdom').env;
    // 设置html环境
    env(data.toString(), function (errors, window) {
        var $ = require('jquery')(window);

       // console.log($('.category-menu-nav').find('.menu-nav').text());
    });

}