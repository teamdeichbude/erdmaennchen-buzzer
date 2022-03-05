/*eslint-env node */

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: {    
      origin: "*",    
      methods: ["GET", "POST"]  
    }});
var path = require('path');

const adminIO = io.of('/admin');
const playerIO = io.of('/player');

let { PlayerConnectionHandler } = require("./playerConnectionHandler");
let { BuzzerController } = require("./buzzerController");

let takenBuzzSounds = [];
let buzzersActive = false;
let buzzerType = 'buzzer'; // or 'text'

const ConnectionHandler = new PlayerConnectionHandler();
const BuzzerControl = new BuzzerController(ConnectionHandler);


app.use(express.static(path.join(__dirname, '../public'))); //serving of static "client" files

app.get('/', function (req, res)
{
  res.sendFile(path.join(__dirname, '../public/player/index.html'));
});

BuzzerControl.playerBroadCast = playerIO;

playerIO.on('connection', function (socket)
{
  console.log('player connected'); //socket connected, but not registered as player, yet.

  ConnectionHandler.addSocket(socket);
  sendDisabledBuzzSounds(); //for players to receive which sounds can be selected

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
      ConnectionHandler.connectPlayer(socket.id, data.playerName, data.playerAudio, buzzersActive, buzzerType);
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

  socket.on("sde-player-buzzed", function (textInput)
  {
    try
    {
      BuzzerControl.playerBuzzed(ConnectionHandler.getPlayerById(socket.id), textInput);
    }
    catch (e)
    {
      console.error(e);
      socket.emit("sde-error", { error: e.message });
    }
  });

  socket.on('sde-player-buzzstate-updated', function (data) {
    console.log(socket.id);
    console.log(data);
    data.playerId = socket.id;
    adminIO.emit('sde-player-buzzstate-updated', data);
  });

  function sendDisabledBuzzSounds() {
    playerIO.emit('sde-player-disableBuzzSounds', takenBuzzSounds);
  }
});

adminIO.on('connection', function(socket){
  console.log('admin connected');
  ConnectionHandler.addAdmin(socket);

  onPlayerConnectionsChanged(); //mainly in case the admin connected after players already joined

  socket.on('sde-admin-connect', function () {
    console.log('admin here!');
  });

  /**
   * buzzerMode is one of "buzzerTypeBuzzer" or "buzzerTypeText"
   */
  socket.on("sde-admin-activate", function (activate, buzzerMode)
  {
    if (buzzerMode === 'buzzerTypeBuzzer') {
      buzzerType = 'buzzer';
    } else if (buzzerMode === 'buzzerTypeText') {
      buzzerType = 'text';
    }

    if (activate) {
      buzzersActive = true;
      BuzzerControl.activateAll(buzzerMode);
    } else {
      buzzersActive = false;
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

  socket.on('sde-player-buzzstate-updated', function (data) {
    console.log(data);

  });

});

function onPlayerConnectionsChanged()
  {
    adminIO.emit("sde-admin-playersChanged", {
      allPlayers: ConnectionHandler.Players
    });
  }

http.listen(3001, function ()
{
  console.log('listening on *:3001');
});