var orm = require("orm");
//var db = orm.connect("mysql://chenhao:chenhao@127.0.0.1/single_buy");

var global_settings = require('./settings');
var db = orm.connect(global_settings.db_settings);

//var db=connection.connect();
// check connection error
db.on('connect',function(err){
    if (err){
        console.log('Can not connect to Mysql.')
    }else{
        console.log('Create successful!')
    }
});

// create db obj
var Person = db.define("person", {
    name      : String,
    surname   : String,
    age       : Number, // FLOAT
    male      : Boolean,
    continent : [ "Europe", "America", "Asia", "Africa", "Australia", "Antartica" ], // ENUM type
    photo     : Buffer, // BLOB/BINARY
    data      : Object // JSON encoded
}, {
    methods: {
        fullName: function () {
            return this.name + ' ' + this.surname;
        }
    },
    validations: {
        age: orm.enforce.ranges.number(18, undefined, "under-age")
    }
});


/*-----example of */
Person.sync(function (err) {
    console.log("done!");
});

var record={}
record.surname='chenhao';
record.age=24;
record.name='chen';

Person.create(record,function(err){
    if(err){
        console.log('Insert into record error.');
    }else{
        console.log('Insert into Person Successful');
    }
})

Person.find({ surname: "chenhao" }, function (err, people) {
    // SQL: "SELECT * FROM person WHERE surname = 'Doe'"

    if (people.length>0){
        console.log("People found: %d", people.length);
        console.log("First person: %s, age %d", people[0].fullName(), people[0].age);

        people[0].surname = 'chenhaha';
        people[0].save(function (err) {
            // err.msg = "under-age";
            if(err){
                 console.log('Update person Fail'+err);
            }else{
                console.log('Update person Successful');
            }
        });

    }else{
        console.log('Can not find result');
    }
});


