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
var basic_url = 'http://list.jd.com/list.html?cat=9987,653,655';
var page_index = 1;
var max_page_index =10;
var timer_id = '';

function getJDGoodsListData(basic_url){
    console.log('page_index = '+page_index);
    var buffer_list = [];
    var goods_url = basic_url + '&page='+page_index+'&JL=6_0_0';
    http.get(goods_url,function(res){
        res.on('data',function(data){
            buffer_list.push(data);
            //console.log(data);
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
    page_index ++ ;
    console.log('========check==========')
    if (page_index == max_page_index){
        console.log('------- over -------')
        clearInterval(timer_id);
    }
}

timer_id = setInterval(getJDGoodsListData, 3000, [basic_url]);



function getJDGoodsData(data) {
    //var decode_string = iconv.decode(data, 'GBK');
    var decode_string = data;
    //console.log(data.toString())
    var env = require('jsdom').env;
    // 设置html环境
    env(decode_string.toString(), function (errors, window) {
        var $ = require('jquery')(window);

        // 获取当前页面的列表数据和图片链接
        var goods_list = $('.list-h').find('li');
        console.log(goods_list.length);
        var image_url_list = [];
        var goods_info_list = [];
        var goods_sku_list = [];
        for (var i = 0; i < goods_list.length; i++) {
            var goods_info = {};
            var goods_sku_id = $(goods_list[i]).attr('sku');
            var goods_url = $(goods_list[i]).find('.lh-wrap .p-img a').attr('href');
            var image_url = $(goods_list[i]).find('.lh-wrap .p-img img').attr('data-lazyload');
            //var goods_desc = $(goods_list[i]).find('.p-name a').attr('title');
            //console.log($(goods_list[i]).find('.p-price').html());
            //console.log($(goods_list[i]).find('.p-name a').html())
            var goods_desc = $(goods_list[i]).find('.lh-wrap .p-name').find('a').text();
            // 这样的方式取得不了价格
            var goods_price = $(goods_list[i]).find('.p-price').text();
            if (typeof(image_url) == 'undefined'){
                continue;
            }
            var goods_sha1 = sha1(image_url);
            goods_info['goods_sku_id'] = goods_sku_id;
            goods_info['goods_sha1'] = goods_sha1;
            goods_info['image_url'] = image_url;
            goods_info['goods_desc'] = goods_desc;
            goods_info['goods_url'] = goods_url;
            goods_info_list.push(goods_info);
            image_url_list.push({'image_url':image_url,'image_sha1':goods_sha1});
            goods_sku_list.push(goods_sku_id);
        }
        //console.log(goods_info_list);
        var script_list = $('script');
        var area_id = '';
        for (var s=0;s<script_list.length;s++){
            if($(script_list[s]).text().indexOf('var params =')>=0){
                var care_params = $(script_list[s]).text().split('var')[1];
                care_params = care_params.replace('params = ','');
                care_params = care_params.replace(';','');
                var area_json = JSON.parse(care_params);
                //console.log(area_json);
                if (area_json.hasOwnProperty('area')){
                    area_id = area_json['area'];
                }
            }
        }
        if(area_id != ''){
            //console.log(goods_sku_list.length);
            getJDGoodsPrice(goods_sku_list,area_id);
        }
        cacheJDGoodsList(goods_info_list);
        // 取得网页里面的script信息，取得获取价格的
        cacheJDImageList(image_url_list);
    });
}

//
function cacheJDGoodsList(goods_list){
    goods_list.forEach(function(obj){
        var goods_obj = JSON.stringify(obj);
        client.lpush('JD_GOODS_LIST',goods_obj,function(err){
            if(err){
                console.log(err);
            }
        })
    });
}


function cacheJDImageList(url_list){
    url_list.forEach(function(obj){
        JD_download.JD_image_download(obj,'goods_image');
        /*client.lpush('JD_GOODS_IMAGE_LIST',obj,function(err){
            if(err){
                console.log(err);
            }
        })*/
    })
}


function getJDGoodsPrice(goods_sku_list,area_key){
    //console.log(area_key);
    var area = area_key.replace(',','_');
    var price_list_buffer = [];
    http.get('http://p.3.cn/prices/mgets?skuIds=J_' + goods_sku_list.join(',J_') + '&type=1&area=' + area ,function(res){
        res.on('data',function(data){
            price_list_buffer.push(data);
        }).on('end',function(){
            var new_buffer = Buffer.concat(price_list_buffer);
            pickJDGoodsPrice(new_buffer);
        }).on('error',function(err){
            console.log(err)
        });
    });
}


var goods_JD_price_dic = {};
function pickJDGoodsPrice(price_list){
    var price_json_list = JSON.parse(price_list);
    price_json_list.forEach(function(obj){
       goods_JD_price_dic[obj['id']] = [obj['p'],obj['m']];
    });
    if(page_index == max_page_index){
        console.log(goods_JD_price_dic);
    }
}

function setPriceIntoGoodsList(){
    client.lrange('JD_GOODS_LIST','0','-1',function(err,data){
        if(err){
            console.log(err);
        }
        var goods_list = data;
        goods_list.forEach(function(obj){
            var goods_obj = JSON.parse(obj);
            var goods_sku_id = goods_obj['goods_sku_id'];
            if (goods_JD_price_dic.hasOwnProperty('J_'+goods_sku_id)){
                goods_obj['JD_price'] = goods_JD_price_dic['J_'+goods_sku_id][0];
                goods_obj['Market_price'] = goods_JD_price_dic['J_'+goods_sku_id][1];
            }else{
                goods_obj['JD_price'] = '';
                goods_obj['Market_price'] = '';
            }

            client.lpush('ALL_JD_GOODS_LIST',JSON.stringify(goods_obj),function(err){
                if(err){
                    console.log(err);
                }
            })
            //return goods_obj;
        });
        // 重新存入缓存里卖弄

       // console.log(new_goods_list);
    })
}


exports.setPriceIntoGoodsList = setPriceIntoGoodsList;