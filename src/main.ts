import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import path from 'path';

import { PlayerConnectionHandler } from './playerConnectionHandler';
import { BuzzerController } from './buzzerController';
import { BuzzerType } from './buzzerType';

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const adminIO = io.of('/admin');
const playerIO = io.of('/player');

let takenBuzzSounds: string[] = [];
let buzzersActive = false;
let buzzerType = BuzzerType.buzzer;

const connectionHandler = new PlayerConnectionHandler();
const buzzerControl = new BuzzerController(connectionHandler);

app.use(express.static(path.join(__dirname, '../public'))); //serving of static "client" files

app.get('/', function (_req: Request, res) {
  res.sendFile(path.join(__dirname, '../public/player/index.html'));
});

buzzerControl.playerBroadCast = playerIO;

playerIO.on('connection', function (socket: Socket) {
  console.log('player connected'); //socket connected, but not registered as player, yet.
  connectionHandler.addSocket(socket);
  sendDisabledBuzzSounds(); //for players to receive which sounds can be selected

  socket.on('disconnect', function () {
    const player = connectionHandler.getPlayerById(socket.id);
    //remove player buzz sound from taken sounds to enable buzz sound again for other players
    if (player) {
      takenBuzzSounds = takenBuzzSounds.filter((sound) => sound !== player.soundIdent);
      sendDisabledBuzzSounds();
    }

    connectionHandler.disconnectPlayer(socket.id);
    //inform admin of playercount changed
    onPlayerConnectionsChanged();
  });

  socket.on('sde-player-connect', function (data) {
    try {
      connectionHandler.connectPlayer(socket.id, data.playerName, data.playerAudio, buzzersActive, buzzerType);
      takenBuzzSounds.push(data.playerAudio);
      sendDisabledBuzzSounds();
    } catch (e) {
      console.error(e);
      socket.emit('sde-error', { error: e.message });
    }

    //inform admin of playercount changed
    onPlayerConnectionsChanged();
  });

  socket.on('sde-player-buzzed', function (textInput) {
    try {
      buzzerControl.playerBuzzed(connectionHandler.getPlayerById(socket.id), textInput);
    } catch (e) {
      console.error(e);
      socket.emit('sde-error', { error: e.message });
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

adminIO.on('connection', function (socket) {
  console.log('admin connected');
  connectionHandler.addAdmin(socket);

  onPlayerConnectionsChanged(); //mainly in case the admin connected after players already joined

  socket.on('sde-admin-connect', function () {
    console.log('admin here!');
  });

  /**
   * buzzerMode is one of "buzzerTypeBuzzer" or "buzzerTypeText"
   */
  socket.on('sde-admin-activate', function (activate, buzzerMode) {
    if (buzzerMode === 'buzzerTypeBuzzer') {
      buzzerType = BuzzerType.buzzer;
    } else if (buzzerMode === 'buzzerTypeText') {
      buzzerType = BuzzerType.text;
    }

    if (activate) {
      buzzersActive = true;
      buzzerControl.activateAll(buzzerMode);
    } else {
      buzzersActive = false;
      console.log('deactivate all buzzers');
      buzzerControl.deactivateAll();
    }
  });

  socket.on('sde-admin-deactivate', function (deactivate) {
    if (deactivate) {
      buzzerControl.deactivateAll();
    }
  });

  socket.on('sde-admin-toggleSingleBuzz', function (data) {
    buzzerControl.singleBuzzMode = data.single;
  });

  socket.on('sde-player-buzzstate-updated', function (data) {
    console.log(data);
  });
});

function onPlayerConnectionsChanged() {
  adminIO.emit('sde-admin-playersChanged', {
    allPlayers: connectionHandler.players,
  });
}

httpServer.listen(3001, function () {
  console.log('listening on *:3001');
});
