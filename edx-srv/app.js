var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var sqlite3 = require('sqlite3')
var db = new sqlite3.Database('edx.db')

app.use(express.static('public/'))

server.listen(80, function(){
  console.log("server booted and listening on ")
})

io.on('connection', function (socket) {
  console.log("connection from ", socket.id)

  socket.on('incSPRCount', function(req, res){
    db.serialize(function(){
      var task = req["task"]
      var getCount = "SELECT value FROM metadata WHERE task='"+task+"' AND variable='count'"
      var incCount = "UPDATE metadata SET value = ? WHERE task='"+task+"' AND variable='count'"
      db.get( getCount, [],
        function(err, row){
          var count = parseInt(row['value'])
          res(count)
          db.serialize(function(){
            count += 1
            db.run(incCount, count)
          })
        }
      )
    })
  })

  socket.on('writeSPRFrankData', function(req, res){
    db.run(
      "INSERT INTO data_events ('subject_id', 'table', 'write_time') VALUES( ?, ?, ?)",
      [req['subject_id'], 'spr_frank', Date.now()],
      function(err){
        event_id = this.lastID
        end = req['data'].length
        db.serialize(function(){
          db.run("BEGIN TRANSACTION")
          for (var i = 0; i < end; i++) {
            datum = req['data'][i]
            db.run(
              "INSERT INTO spr_frank ('event_id', 'train', 'sent_num', 'word_num', 'word', 'rt', 'sentence', 'corr') VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
              [event_id, datum.train, datum.sent_num, datum.word_num, datum.word, datum.RT, datum.sentence, datum.corr]
            )
          }
          db.run("COMMIT")
        })
      }
    )
  })

  socket.on('writeSPRNewportData', function(req, res){
    db.run(
      "INSERT INTO data_events ('subject_id', 'table', 'write_time') VALUES( ?, ?, ?)",
      [req['subject_id'], 'spr_newport', Date.now()],
      function(err){
        event_id = this.lastID
        end = req['data'].length
        db.serialize(function(){
          db.run("BEGIN TRANSACTION")
          for (var i = 0; i < end; i++) {
            datum = req['data'][i]
            db.run(
              "INSERT INTO spr_newport ('event_id', 'train', 'sent_num', 'word_num', 'word', 'rt', 'sentence', 'corr', 'gram', 'group' ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [event_id, datum.train, datum.sent_num, datum.word_num, datum.word, datum.RT, datum.sentence, datum.corr, datum.gram, datum.group]
            )
          }
          db.run("COMMIT")
        })
      }
    )
  })

  socket.on('login', function(req,res){
    db.get(
      "SELECT * FROM subjects WHERE email=?",
      req['email'],
      function(err, row){
        res(row)
      }
    )
  })

  socket.on('register', function(req, res){
    db.get(
      "SELECT * FROM subjects WHERE email=?",
      req['email'],
      function(err, row){
        if (!row) {
          db.run("INSERT INTO subjects ('email', 'password') VALUES (?, ?)",
          [req['email'], req['password']],
          function (err) {
            subject_id = this.lastID
            res({'status': 'created', 'subject_id': subject_id})
          })
        }
        else { res({'status': 'taken'}) }
      }
    )
  })

  socket.on('dbAll', function(req, res){
    var sql = req['sql']
    var params = req['params']
    db.all(sql, params, function(err, rows){
      res(rows)
    })
  })

  socket.on('dbGet', function(req, res){
    var sql = req['sql']
    var params = req['params']
    db.get(sql, params, function(err, row){
      res(row)
    })
  })

})
