var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let { PlayerConnectionHandler } = require("./playerConnectionHandler");
let { BuzzerController } = require("./buzzerController");

const ConnectionHandler = new PlayerConnectionHandler();
const BuzzerControl = new BuzzerController(ConnectionHandler);

app.use(express.static('public')) //serving of static "client" files

io.on('connection', function (socket)
{
  console.log('a user connected'); //socket connected, but not registered as player, yet.

  ConnectionHandler.addSocket(socket);

  socket.on('disconnect', function ()
  {
    ConnectionHandler.disconnectPlayer(socket.id);
    //inform admin of playercount changed
    onPlayerConnectionsChanged();
  });

  socket.on("sde-player-connect", function (data)
  {
    try {
      ConnectionHandler.connectPlayer(socket.id, data.playerName, data.playerAudio)
    }
    catch(e) {
      console.error(e);
      socket.emit("sde-error", {error: e.message});
    }

    //inform admin of playercount changed
    onPlayerConnectionsChanged();
  });

  socket.on("sde-player-buzzed", function (data)
  {
    BuzzerControl.playerBuzzed(ConnectionHandler.getPlayerById(socket.id));
  });

  socket.on("sde-admin-activate", function (activate)
  {
    if (activate)
    {
      BuzzerControl.activateAll();
    }
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