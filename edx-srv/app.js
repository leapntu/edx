var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

app.use(express.static('public/'))

server.listen(80, function(){
  console.log("server booted and listening on ")
})

io.on('connection', function (socket) {
  console.log("connection from ", socket.id)
})
