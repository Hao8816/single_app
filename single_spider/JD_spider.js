var http = require('http');
// 解决nodejs不支持gbk编码的问题
var iconv = require('iconv-lite');

// 请求Tmall的首页，爬取手机分类

http.get('http://www.jd.com/allSort.aspx',function(res){
    res.on('data',function(data){
        //console.log(res.charset);
        var encoding = res.headers['content-type'];
        getJDData(data,encoding);
        //console.log(data.toString())
    }).on('error',function(err){
        console.error('can not get response from tmall');
    })
}).on('error',function(e){
    console.error('can not request tmall');
});


function getJDData(data,encoding){
    //console.log(data.toString('gb2312'));
    //console.log(encoding);
    var charset = 'utf8';
    if (encoding.indexOf('charset')>0){
        //charset = encoding.search
    }
    var decode_string = iconv.decode(data,'GB2312');
    //var decode_string = data;
    //console.log(decode_string)
    var env = require('jsdom').env;
    // 设置html环境
    env(decode_string.toString(), function (errors, window) {
        try{
            var $ = require('jquery')(window);
            var item_list = $('.m');
            var item_data = {};
            var title_data = {};
            console.log(item_list.length)
            for(var i=0;i<item_list.length;i++){
                var sub_titles = $(item_list[i]).find('.mc').find('dl');
                var title_1 = $(item_list[i]).find('.mt a').text();
                var title_1_link = $(item_list[i]).find('.mt a').attr('href');
                var sub_title_data={};
                for(var j = 0;j<sub_titles.length;j++){
                    var sub_title = $(sub_titles[j]).find('dt').text();
                    var sub_link_list = $(sub_titles[j]).find('dd').find('em');
                    var sub_link_text_list=[];
                    for(var k=0;k<sub_link_list.length;k++){
                        var text = $(sub_link_list[k]).find('a').text();
                        sub_link_text_list.push(text);
                    }
                    sub_title_data[sub_title] = sub_link_text_list;
                }
                title_data[title_1] = sub_title_data;
            }
            console.log(title_data);

        } catch(e) {
            console.log(e);
        }
    });
}