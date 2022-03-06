"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuzzerController = void 0;
const dateformat = require("dateformat");
const buzzerType_1 = require("./buzzerType");
class BuzzerController {
    constructor(connectionHandler) {
        this.connectionHandler = connectionHandler;
        this.buzzOrder = [];
        this.singleBuzzMode = false;
        this.playerBroadCast = null;
        this.buzzOrder = [];
    }
    playerBuzzed(player, textInput) {
        if (!player) {
            throw new Error("player cant buzz before being connected properly. Please connect with valid name first.");
        }
        if (player.canBuzz) {
            const win = this.buzzOrder.length === 0;
            this.setBuzzerState(player, false, win);
            if (this.singleBuzzMode) {
                this.deactivateAll(player.id, false);
            }
            player.lastBuzzTime = Date.now();
            this.buzzOrder.push(player);
            if (this.playerBroadCast) {
                const data = { player: player, isFirstBuzz: win, time: player.lastBuzzTime, formattedTime: dateformat(player.lastBuzzTime, "H:MM:ss.l") };
                this.playerBroadCast.emit("sde-player-buzzed", data);
                this.connectionHandler.getAdminSocket().emit('sde-player-buzzed', Object.assign(Object.assign({}, data), { 'textInput': textInput }));
            }
        }
    }
    activateAll(buzzerType) {
        this.buzzOrder = [];
        for (const p of this.connectionHandler.players) {
            this.setBuzzerType(p, buzzerType);
            this.setBuzzerState(p, true);
            p.lastBuzzTime = null;
            console.log("player", p.name, "activated");
        }
    }
    deactivateAll(excludeId, sendWin = null) {
        for (const p of this.connectionHandler.players) {
            if (p.id !== excludeId) {
                this.setBuzzerState(p, false, sendWin);
                p.lastBuzzTime = null;
                console.log("player", p.name, "deactivated");
            }
        }
    }
    setBuzzerType(player, mode) {
        let emitEventName = "sde-player-buzztypebuzz";
        if (mode === buzzerType_1.BuzzerType.text) {
            emitEventName = "sde-player-buzztypetext";
        }
        this.connectionHandler
            .getSocketById(player.id)
            .emit(emitEventName);
    }
    setBuzzerState(player, state, win) {
        player.canBuzz = state;
        this.connectionHandler.getSocketById(player.id)
            .emit("sde-player-buzzstatechange", { enabled: state, win: win });
    }
}
exports.BuzzerController = BuzzerController;
//# sourceMappingURL=buzzerController.js.map