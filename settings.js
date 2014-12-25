//var fs = require('fs');
//var NodeRSA = require('node-rsa');
//var key = new NodeRSA({b: 512});
// 定义项目所有的配置

var Database_Settings={
    host     : "127.0.0.1",
    database : "single",
    user     : "chenhao",
    password : "chenhao",
    protocol : "mysql",
    //socketPath: '/var/run/mysqld/mysqld.sock',
    port     : "3306"
};

// 获取node ras 的 private key
// var RSA_Private_Key = key.getPrivatePEM();

// 获取node ras 的 public key
// var RSA_Public_Key = key.getPublicPEM();

exports.db_settings=Database_Settings;
// exports.rsa_private_key=RSA_Private_Key;
// exports.rsa_public_key=RSA_Public_Key;
// exports.rsa_key=key;