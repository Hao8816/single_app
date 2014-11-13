var orm = require("orm");
var global_settings = require('../settings');
var db = orm.connect(global_settings.db_settings);
var date= new Date();
// check connection error
db.on('connect',function(err){
    if (err){
        console.log('Can not connect to Mysql.')
    }else{
        console.log('Create successful!')
    }
});


/*
*  text: A text string;
*  number: A floating point number. You can specify size: 2|4|8.
*  integer: An integer. You can specify size: 2|4|8.
*  boolean: A true/false value;
*  date: A date object. You can specify time: true
*  enum: A value from a list of possible values;
*  object: A JSON object;
*  point: A N-dimensional point (not generally supported);
*  binary: Binary data.
*  serial: Auto-incrementing integer. Used for primary keys.
*/

//All types support
/*
*  required (boolean)
*  unique (boolean)
*  defaultValue (text)
*  Text type also supports maximum size of string (number) and big (boolean - for very long strings).
*  Number type is a float, size (number - byte size) and unsigned (boolean).
*  Date type supports time (boolean).
*/

var User = db.define("user",{
    time     : {type:"text"},
    name     : {type:"text",size:"50"},
    sha1     : {type:"text",size:"50"},
    age      : {type:"integer"},
    password : {type:"text",size:"255"},
    phone    : {type:"text",size:"50"},
    email    : {type:"text",size:"50"},
    location : {type:"text"}
},{
    methods:{
        checkName: function () {
            return this.name + ' ' + this.surname;
        }
    },
    validations:{

    }
});

var Goods = db.define("goods",{
    time       :{type:"text"},
    status     :{type:"integer"},
    name       :{type:"text"},
    sha1       :{type:"text",size:"50"},
    description:{type:"text"},
    price      :{type:"integer"},
    picture    :{type:"text"},
    tag        :{type:"object"},
    qcode      :{type:'text'},
    color      :{type:"text"},
    size       :{type:"text"},
    category_id:{type:"text"},
    shop_id    :{type:"text"}
},{
    methods:{
        checkName: function () {
            return this.name + ' ' + this.surname;
        },
        insertTime:function(){
            return date.getTime();
        }

    },
    validations:{

    }
});

var Item_Record = db.define('item_record',{
    status     :{type:"integer"},
    name       :{type:"text"},
    sha1       :{type:"text",size:"50"},
    url        :{type:"text"},
    descc      :{type:"text"},
    shop_name  :{type:"text"},
    price      :{type:"text"}
});

exports.DB=db;
exports.User = User;
exports.Goods = Goods;
exports.Item_Record = Item_Record;


