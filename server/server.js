/*eslint-env node */


var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

let { PlayerConnectionHandler } = require("./playerConnectionHandler");
let { BuzzerController } = require("./buzzerController");

let takenBuzzSounds = [];

const ConnectionHandler = new PlayerConnectionHandler();
const BuzzerControl = new BuzzerController(ConnectionHandler);

app.use(express.static(path.join(__dirname, '../public'))); //serving of static "client" files

app.get('/', function (req, res)
{
  res.sendFile(path.join(__dirname, '../public/player/index.html'));
});

io.on('connection', function (socket)
{
  BuzzerControl.BroadcastSocket = io;
  
  console.log('a user connected: ' + socket); //socket connected, but not registered as player, yet.

  ConnectionHandler.addSocket(socket);
  sendDisabledBuzzSounds();

  socket.on('disconnect', function ()
  {
    let player = ConnectionHandler.getPlayerById(socket.id);
    //remove player buzz sound from taken sounds to enable buzz sound again for other players
    if (player) {
      takenBuzzSounds = takenBuzzSounds.filter(sound => sound !== player.soundIdent);
      sendDisabledBuzzSounds();
    }
  
    ConnectionHandler.disconnectPlayer(socket.id);
    //inform admin of playercount changed
    onPlayerConnectionsChanged();
  });

  socket.on("sde-player-connect", function (data)
  {
    try
    {
      ConnectionHandler.connectPlayer(socket.id, data.playerName, data.playerAudio);
      takenBuzzSounds.push(data.playerAudio);
      sendDisabledBuzzSounds();
    }
    catch (e)
    {
      console.error(e);
      socket.emit("sde-error", { error: e.message });
    }

    //inform admin of playercount changed
    onPlayerConnectionsChanged();
  });

  socket.on("sde-player-buzzed", function (data)
  {
    try
    {
      BuzzerControl.playerBuzzed(ConnectionHandler.getPlayerById(socket.id));
    }
    catch (e)
    {
      console.error(e);
      socket.emit("sde-error", { error: e.message });
    }
  });

  socket.on("sde-admin-activate", function (activate)
  {
    if (activate){
      BuzzerControl.activateAll();
    } else {
      console.log('deactivate all buzzers');
      BuzzerControl.deactivateAll();
    }
  });

  socket.on("sde-admin-deactivate", function (deactivate)
  {
    if (deactivate)
    {
      BuzzerControl.deactivateAll();
    }
  });

  socket.on("sde-admin-toggleSingleBuzz", function (data)
  {
    BuzzerControl.singleBuzzMode = data.single;
  });

  function onPlayerConnectionsChanged()
  {
    io.emit("sde-admin-playersChanged", {
      allPlayers: ConnectionHandler.Players
    });
  }

  function sendDisabledBuzzSounds() {
    io.emit('sde-player-disableBuzzSounds', takenBuzzSounds);
  }
});

http.listen(3001, function ()
{
  console.log('listening on *:3001');
});