var http = require('http');
var $ = require('jQuery')

http.get('http://www.baidu.com',function(req){
   req.on('data',function(data){
       var data_string = data.toString();
       console.log(data_string)
       $doc = $(data_string);
       console.log($doc);
       var env = require('jsdom').env;
       var html = '<html><body><h1>Hello World!</h1><p class="hello">Heya Big World!</body></html>';

       // first argument can be html string, filename, or url
       env(html, function (errors, window) {
           console.log(errors);

           var $ = require('jquery')(window);

           console.log($('.hello').text());
       });

   });
});