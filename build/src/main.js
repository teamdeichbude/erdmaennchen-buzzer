"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const path_1 = require("path");
const playerConnectionHandler_1 = require("./playerConnectionHandler");
const buzzerController_1 = require("./buzzerController");
const buzzerType_1 = require("./buzzerType");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
const adminIO = io.of('/admin');
const playerIO = io.of('/player');
let takenBuzzSounds = [];
let buzzersActive = false;
let buzzerType = buzzerType_1.BuzzerType.buzzer;
const connectionHandler = new playerConnectionHandler_1.PlayerConnectionHandler();
const buzzerControl = new buzzerController_1.BuzzerController(connectionHandler);
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/', function (_req, res) {
    res.sendFile(path_1.default.join(__dirname, '../public/player/index.html'));
});
buzzerControl.playerBroadCast = playerIO;
playerIO.on('connection', function (socket) {
    console.log('player connected');
    connectionHandler.addSocket(socket);
    sendDisabledBuzzSounds();
    socket.on('disconnect', function () {
        const player = connectionHandler.getPlayerById(socket.id);
        if (player) {
            takenBuzzSounds = takenBuzzSounds.filter((sound) => sound !== player.soundIdent);
            sendDisabledBuzzSounds();
        }
        connectionHandler.disconnectPlayer(socket.id);
        onPlayerConnectionsChanged();
    });
    socket.on('sde-player-connect', function (data) {
        try {
            connectionHandler.connectPlayer(socket.id, data.playerName, data.playerAudio, buzzersActive, buzzerType);
            takenBuzzSounds.push(data.playerAudio);
            sendDisabledBuzzSounds();
        }
        catch (e) {
            console.error(e);
            socket.emit('sde-error', { error: e.message });
        }
        onPlayerConnectionsChanged();
    });
    socket.on('sde-player-buzzed', function (textInput) {
        try {
            buzzerControl.playerBuzzed(connectionHandler.getPlayerById(socket.id), textInput);
        }
        catch (e) {
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
    onPlayerConnectionsChanged();
    socket.on('sde-admin-connect', function () {
        console.log('admin here!');
    });
    socket.on('sde-admin-activate', function (activate, buzzerMode) {
        if (buzzerMode === 'buzzerTypeBuzzer') {
            buzzerType = buzzerType_1.BuzzerType.buzzer;
        }
        else if (buzzerMode === 'buzzerTypeText') {
            buzzerType = buzzerType_1.BuzzerType.text;
        }
        if (activate) {
            buzzersActive = true;
            buzzerControl.activateAll(buzzerMode);
        }
        else {
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
//# sourceMappingURL=main.js.map