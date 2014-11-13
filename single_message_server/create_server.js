var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// 监听connection的变化

io.on('connection',function(socket){
    //console.log(socket)
    console.log('receive a socket connection');
    //io.sockets.socket(socket.id).emit('message', 'for your eyes only');
    socket.on('connect',function(){
        console.log(socket.id);
    });
    socket.on('message',function(msg){
        console.log(msg);
        // 根据不同的发送者，来分发消息
        socket.broadcast.emit('message',msg);
    });
    socket.on('disconnect',function(msg){
        console.log(msg);
        io.emit('message',msg);
    });
});

io.on('disconnect',function(socket){
   console.log('disconnect from server');
});

io.on('error',function(socket){
    console.log('error from server');
});

// 创建httpserver
http.listen(8089,function(){
   console.log('start message server successfully, port 8089');
});