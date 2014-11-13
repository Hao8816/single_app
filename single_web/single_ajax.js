var express = require('express');
var models = require('./single_model');
var redis_api = require('./redis_client')
var global_settings = require('../settings');

// 定义一些 ajax url 对应的处理方法

var rsa_key=global_settings.rsa_key;

function start(req,res) {
    var name=req.param('name');
    models.User.find({ name: "chenhao" },function(err,result){
       var rsdic={};
       if(err){
           console.log('can not find');
       }else{
           console.log(result);
           rsdic['users']=result;
           rsdic['info']='Reauest OK';
           rsdic['user_name']=name;
           res.send(rsdic);
           res.end();
       }
    })
};

function checkUserName(req,res){
    var user_name=req.param('name');
    var password=req.param('password');
    //var decrypt_password = rsa_key.decrypt(password);
    //var hmac = crypto.createHmac('sha1', rsa_public_key);
    //var encrypted_password= 'cc';
    models.User.find({ name:user_name,password:password},function(err,result){
        var rsdic={};
        if(err){
            console.log('can not find');
            rsdic['ret']='0002'
            rsdic['info']='Waring';
        }else{
            if(result.length==1){
                rsdic['ret']='0001';
            }else{
                rsdic['ret']='0003';
            }
            rsdic['info']='Success';
        }
        res.send(rsdic);
        res.end();
    })
};

function getGoogsList(req,res){
   models.Item_Record.find({status:"1"},function(err,result){
       var rsdic={};
       if(err){
           console.log('get good list error')
       }else{
           rsdic['goods']=result;
           rsdic['ret']='0001';
           rsdic['info']='Success';
       }
       res.send(rsdic);
       res.end();
   })
};


function getCategoryGoodList(req,res){
    models.Item_Record.find({status:"1"},function(err,result){
        var rsdic={};
        if(err){
            console.log('get good list error')
        }else{
            rsdic['goods']=result;
            //存入缓存
            redis_api.getValueByKey('goods_lis1',result);
            console.log('-----save redis success-----');
            rsdic['ret']='0001';
            rsdic['info']='Success';
        }
        res.send(rsdic);
        res.end();
    })
};

exports.start = start;
exports.checkUserName = checkUserName;
exports.getGoodList = getGoogsList;
exports.getCategoryGoodList = getCategoryGoodList;
