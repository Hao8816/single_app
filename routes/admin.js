var express = require('express');
var router = express.Router();

/* GET location page. */
router.get('/manager/', function(req, res) {
    res.render('single_web_admin.html', { title: 'Single Share' });
});

router.get('/store_manage/',function(req,res){
    res.render('single_web_store_manage.html', { title: 'Store Manage' });
});

router.get('/goods_manage/',function(req,res){
    res.render('single_web_goods_manage.html', { title: 'Goods Manage' });
});

router.get('/order_manage/',function(req,res){
    res.render('single_web_order_manage.html', { title: 'Order Manage' });
});

router.get('/service_manage/',function(req,res){
    res.render('single_web_service_manage.html', { title: 'Goods Manage' });
});

router.get('/complain_manage/',function(req,res){
    res.render('single_web_complain_manage.html', { title: 'Goods Manage' });
});


module.exports = router;
