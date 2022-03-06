"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerConnectionHandler = void 0;
const buzzerType_1 = require("./buzzerType");
const player_1 = require("./player");
class PlayerConnectionHandler {
    constructor() {
        this.players = [];
        this.sockets = [];
        this.admin = null;
    }
    addSocket(socket) {
        this.sockets.push(socket);
    }
    addAdmin(socket) {
        this.admin = socket;
    }
    getSocketById(id) {
        return this.sockets.find(function (item) {
            return item.id === id;
        });
    }
    getPlayerById(id) {
        return this.players.find(function (item) {
            return item.id === id;
        });
    }
    getAdminSocket() {
        return this.admin;
    }
    connectPlayer(playerId, playerName, playerAudioIdent, buzzerActive, buzzerType) {
        const exisitingPlayer = this.getPlayerById(playerId);
        if (exisitingPlayer) {
            throw new Error('player with id ' + playerId + ' already exists under the name:' + exisitingPlayer.name);
        }
        const player = new player_1.Player(playerId, playerName, playerAudioIdent, buzzerActive);
        this.players.push(player);
        this.getSocketById(player.id).emit('sde-player-buzzstatechange', { enabled: buzzerActive, win: null });
        if (buzzerType === buzzerType_1.BuzzerType.text) {
            this.getSocketById(player.id).emit('sde-player-buzztypetext');
        }
    }
    disconnectPlayer(playerId) {
        this.players = this.players.filter(function (item) {
            return item.id !== playerId;
        });
    }
}
exports.PlayerConnectionHandler = PlayerConnectionHandler;
//# sourceMappingURL=playerConnectionHandler.js.map