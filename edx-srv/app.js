var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

app.use(express.static('public/'))

server.listen(3000, function(){
  console.log("server booted and listening")
})

io.on('connection', function (socket) {
  console.log("connection")
  io.emit('news', { hello: 'world' })
  socket.on('my other event', function (data) {
    console.log(data)
  })
})
