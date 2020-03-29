var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let { PlayerConnectionHandler } = require("./playerConnectionHandler");

const ConnectionHandler = new PlayerConnectionHandler();

app.use(express.static('public')) //serving of static "client" files

io.on('connection', function (socket)
{
  console.log('a user connected'); //socket connected, but not registered as player, yet.

  socket.on('disconnect', function ()
  {
    ConnectionHandler.disconnectPlayer(socket.id);
    //inform admin of playercount changed
    onPlayerConnectionsChanged();
  });

  socket.on("sde-player-connect", function (data)
  {
    ConnectionHandler.connectPlayer(socket.id, data.playerName, data.playerAudio)

    //inform admin of playercount changed
    onPlayerConnectionsChanged();
  });

  function onPlayerConnectionsChanged()
  {
    io.emit("sde-admin-playersChanged", {
      allPlayers: ConnectionHandler.Players
    });
  }

});

http.listen(3000, function ()
{
  console.log('listening on *:3000');
});