// 定义搜索的一些关键词

var JD_download = require('./JD_image_spider');
var http = require('http');

var sha1 = require('sha1');
var redis = require('redis');
var client =  redis.createClient();
// 解决nodejs不支持gbk编码的问题
var iconv = require('iconv-lite');


// 定义buffer对象来存储返回的数据

// 当前是显示手机页面的链接
var catagory_url = 'http://list.jd.com/list.html?cat=9987,653,655';
var category_name = 'PHONE'
var buffer_list = [];
http.get(catagory_url,function(res){
    res.on('data',function(data){
        buffer_list.push(data);
        //console.log(data);
    }).on('end',function(){
        var new_buffer = Buffer.concat(buffer_list);
        getJDCategoryData(new_buffer);
        console.log('success')
    }).on('error',function(err){
        console.error('can not get response from JD');
    })
}).on('error',function(e){
    console.error('can not request JD');
});


function getJDCategoryData(data) {
    //var decode_string = iconv.decode(data, 'GBK');
    var decode_string = data;
    //console.log(data.toString())
    var env = require('jsdom').env;
    // 设置html环境
    env(decode_string.toString(), function (errors, window) {
        var $ = require('jquery')(window);
        var band_data_list = []
        var logo_band_list = $('.attrs .brand-attr .a-values .tabcon').find('div[more="false"]');
        for (var i=0;i<logo_band_list.length;i++){
            var band_obj = {}
            var title = $(logo_band_list[i]).find('a').attr('title');
            var band_logo_url = $(logo_band_list[i]).find('a img').attr('src');
            var band_sha1 = sha1(band_logo_url);
            band_obj['band_title'] = title;
            band_obj['band_index'] = 1;
            band_obj['band_logo_url'] = band_logo_url;
            band_obj['band_sha1'] = band_sha1;
            band_data_list.push(band_obj);

            JD_download.JD_image_download({'image_url':band_logo_url,'image_sha1':band_sha1},'band_logo');
        }
        var unlogo_band_list = $('.attrs .brand-attr .a-values .tabcon').find('div[more="true"]');
        for (var i=0;i<unlogo_band_list.length;i++){
            var band_obj = {}
            var title = $(unlogo_band_list[i]).find('a').attr('title');
            var band_logo_url = $(unlogo_band_list[i]).find('a img').attr('src');
            if(typeof (band_logo_url) == 'undefined'){
                continue;
            }
            var band_sha1 = sha1(band_logo_url);
            band_obj['band_title'] = title;
            band_obj['band_index'] = 2;
            band_obj['band_logo_url'] = band_logo_url;
            band_obj['band_sha1'] = band_sha1;
            band_data_list.push(band_obj);
            JD_download.JD_image_download({'image_url':band_logo_url,'image_sha1':band_sha1},'band_logo');
        }
        //console.log(band_data_list);
        cacheJDCategoryBandData(category_name,band_data_list);

        var prop_list = $('.attrs .prop-attrs');
        var prop_data = {};
        for(var i=0;i<prop_list.length;i++){
            var prop_title = $(prop_list[i]).find('.a-key').text();
            var prop_attr_list = $(prop_list[i]).find('.a-values').find('.f-list li');
            console.log(prop_attr_list.length);
            var attr_data_list = []
            for(var j=0;j<prop_attr_list.length;j++){
                var attr = $(prop_attr_list[j]).find('a').text();
                attr_data_list.push(attr);
            }
            prop_data[prop_title] = attr_data_list;
        }
        console.log(prop_data);
        cacheJDCategoryPropData(prop_data);
    });
}


// cache category data
function cacheJDCategoryBandData(band_name,band_list){
    client.hset('JD_CATEGORY_BAND',band_name,JSON.stringify(band_list),function(err){
        if (err) {
            console.log(err);
        }
    })
}

function cacheJDCategoryPropData(prop_data){
    for(prop in prop_data){
        client.hset('JD_CATEGORY_PHONE_PROP',prop,JSON.stringify(prop_data[prop]),function(err){
            if (err) {
                console.log(err);
            }
        })
    }
}
