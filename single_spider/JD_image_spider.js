// file download

var http = require('http');
var fs = require('fs');

function JD_image_download(file_url){
    // 取得文件名的后缀
    var file_path = file_url.split('/');
    var file_name = file_path[file_path.length-1];
    var file = fs.createWriteStream(file_name);
    http.get(file_url,function(res){
        res.on('data',function(data){
            file.write(data);
        }).on('end',function(){
            file.end();
        }).on('error',function(err){console.log(err)});

    });
}


exports.JD_image_download = JD_image_download;