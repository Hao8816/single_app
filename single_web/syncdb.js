var models = require('./single_model');
var sha1 = require('js-sha1');


// syncdb

models.DB.sync();
var date = new Date();

var user1={
    name:'chenhao',
    password:'chenhao',
    email:'15238228816@163.com'
};

var goods1={
    time       :date.getTime(),
    status     :1,
    name       :'三星I9300',
    sha1       :sha1(date.getTime()+'a'),
    description:'好手机，你值得拥有！',
    price      :2300,
    picture    :'i9300.jpg',
    tag        :['好用','实惠'],
    qcode      :'123456',
    color      :'red',
    size       :'100',
    category_id:'1',
    shop_id    :'1'
}
var goods2={
    time       :date.getTime(),
    status     :1,
    name       :'苹果5s',
    sha1       :sha1(date.getTime()+'b'),
    description:'引领时尚风潮，尽享奢华人生',
    price      :5300,
    picture    :'iphone5s.jpg',
    tag        :['奢华','商务','尊贵'],
    qcode      :'123457',
    color      :'white',
    size       :'200',
    category_id:'1',
    shop_id    :'1'
}

var goods3={
    time       :date.getTime(),
    status     :1,
    name       :'诺基亚1020',
    sha1       :sha1(date.getTime()+'c'),
    description:'手机中的单反，高质量拍照功能',
    price      :3300,
    picture    :'nokia1020.jpg',
    tag        :['高档','商务','尊贵'],
    qcode      :'123458',
    color      :'white',
    size       :'200',
    category_id:'1',
    shop_id    :'1'
}
var goods4={
    time       :date.getTime(),
    status     :1,
    name       :'HTC M8',
    sha1       :sha1(date.getTime()+'d'),
    description:'拍照神器，1080P全高清屏，支持NFC',
    price      :2900,
    picture    :'htcm8.jpg',
    tag        :['高档','商务','尊贵'],
    qcode      :'123459',
    color      :'white',
    size       :'200',
    category_id:'1',
    shop_id    :'1'
}
var goods5={
    time       :date.getTime(),
    status     :1,
    name       :'华为P6',
    sha1       :sha1(date.getTime()+'e'),
    description:'美颜自拍',
    price      :1700,
    picture    :'huaweip6.jpg',
    tag        :['高档','国产','尊贵'],
    qcode      :'123460',
    color      :'white',
    size       :'200',
    category_id:'1',
    shop_id    :'1'
}
var goods6={
    time       :date.getTime(),
    status     :1,
    name       :'魅族MX3',
    sha1       :sha1(date.getTime()+'f'),
    description:'1080P全高清屏',
    price      :2300,
    picture    :'meizumx3.jpg',
    tag        :['高档','国产','尊贵'],
    qcode      :'123458',
    color      :'white',
    size       :'200',
    category_id:'1',
    shop_id    :'1'
}
var goods7={
    time       :date.getTime(),
    status     :1,
    name       :'OPPO R8007',
    sha1       :sha1(date.getTime()+'g'),
    description:'好声音，待机时间长',
    price      :2600,
    picture    :'oppor8007.jpg',
    tag        :['高档','商务','尊贵'],
    qcode      :'123446',
    color      :'white',
    size       :'200',
    category_id:'1',
    shop_id    :'1'
}
var goods8={
    time       :date.getTime(),
    status     :1,
    name       :'SONY Z1',
    sha1       :sha1(date.getTime()+'h'),
    description:'好声音，待机时间长',
    price      :2900,
    picture    :'sonyz1.jpg',
    tag        :['高档','商务','尊贵'],
    qcode      :'123449',
    color      :'white',
    size       :'200',
    category_id:'1',
    shop_id    :'1'
}


var goods_list=[goods1,goods2,goods3,goods4,goods5,goods6,goods7,goods8];

for (var i=0;i<goods_list.length;i++){
    models.Goods.create(goods_list[i],function(err,data){
        if(err){
            console.log('Create Goods Error!');
        }else{
            console.log('Create Goods Success!')
        }
    });

}

models.User.create(user1,function(err,data){
    if(err){
        console.log('Init DB error!');
    }else{
        console.log('Insert record successful!');
    }
});