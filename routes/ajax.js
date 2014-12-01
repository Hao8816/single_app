
//路由所有的 ajax 请求，指定到single_ajax里面的函数进行处理

var express = require('express');
var router = express.Router();
var single_ajax = require('../single_web/single_ajax')

router.post('/start/',function(req,res){
    res.set('Content-Type', 'text/plain');
    single_ajax.start(req,res);
});

router.post('/check_user_name/',function(req,res){
    single_ajax.checkUserName(req,res);
});

router.post('/get_good_list/',function(req,res){
    single_ajax.getGoodList(req,res);
});

router.post('/get_category_good_list/',function(req,res){
    single_ajax.getCategoryGoodList(req,res);
});

router.post('/get_goods_band_list/',function(req,res){
    single_ajax.getGoodsBandList(req,res);
})


router.post('/get_goods_attr_list/',function(req,res){
    single_ajax.getGoodsAttrList(req,res);
});


module.exports = router;
