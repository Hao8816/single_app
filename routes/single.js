var express = require('express');
var router = express.Router();
var models = require('../single_web/single_model');

var global_settings = require('../settings');

var rsa_public_key=global_settings.rsa_public_key;



/* GET login page. */
router.get('/login/', function(req, res) {
    res.render('single_web_login.html', { title: 'Single',public_key:rsa_public_key });
});

/* GET index page. */
router.get('/', function(req, res) {
    res.render('single_web_index.html', { title: 'Single' });
});


/* GET index page. */
router.get('/index/', function(req, res) {
  res.render('single_web_index.html', { title: 'Single' });
});

/* GET location page. */
router.get('/location/', function(req, res) {
    res.render('single_web_location.html', { title: 'Single Location' });
});

/* GET location page. */
router.get('/store/', function(req, res) {
    res.render('single_web_store.html', { title: 'Single Store' });
});

/* GET location page. */
router.get('/share/', function(req, res) {
    res.render('single_web_share.html', { title: 'Single Share' });
});

/* GET location page. */
router.get('/chat/', function(req, res) {
    res.render('single_web_chat.html', { title: 'Single Chat' });
});



/* GET location page. */
router.get('/goods/', function(req, res) {
    var goods_sha1 = req.param('id');
    models.Item_Record.find({sha1:goods_sha1},function(err,result){
        var rsdic={};
        if(err){
            console.log('get good list error')
        }else{
            if (result.length==1){
                rsdic['goods']=result[0];
                rsdic['ret']='0001';
                rsdic['info']='Success';
            }else{
                rsdic['goods']={};
                rsdic['ret']='0002';
                rsdic['info']='Error';
            }
        }
        res.render('single_web_goods.html', { title: 'Single Goods','data':rsdic});
    })
});


/* GET location page. */
router.get('/category/', function(req, res) {
    res.render('single_web_category.html', { title: 'Single Category' });
});

/* GET shopping cart page. */
router.get('/cart/', function(req, res) {
    res.render('single_web_cart.html', { title: 'Single Cart' });
});


module.exports = router;


function getGoodsInfoBySha1(goods_sha1){



}