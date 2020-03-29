var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var { Player: Player } = require("./player.js");

let Players = [];
let AdminSocket = null;

app.use(express.static('public'))

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function (socket)
{
  console.log('a user connected');


  socket.on('disconnect', function ()
  {
    console.log('user disconnected');
  });

  socket.on("sde-connectPlayer", function (data)
  {
    connectPlayer(data.playerName, data.playerAudio)
    console.log("player added");
    io.emit("sde-admin-playerAdded", {
      allPlayers: Players
    });
  });

});


function connectPlayer(playerName, playerAudioIdent)
{
  let player = new Player(playerName, playerAudioIdent);
  Players.push(player);
};




http.listen(3000, function ()
{
  console.log('listening on *:3000');
});