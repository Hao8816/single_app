// file download

var http = require('http');
var fs = require('fs');

function JD_image_download(file_obj,file_folder){
    // 取得文件名的后缀
    var image_url = file_obj['image_url'];
    var image_sha1 = file_obj['image_sha1'];
    var file_path = image_url.split('.');
    var file_type = file_path[file_path.length-1];
    var file = fs.createWriteStream('images/'+file_folder+'/'+image_sha1+'.'+file_type);
    http.get(image_url,function(res){
        res.on('data',function(data){
            file.write(data);
        }).on('end',function(){
            file.end();
        }).on('error',function(err){console.log(err)});

    });
}


exports.JD_image_download = JD_image_download;
