import { PlayerConnectionHandler } from './playerConnectionHandler';
import * as dateformat from 'dateformat';
import { Player } from './player';
import { BuzzerType } from './buzzerType';

export class BuzzerController {
    private buzzOrder = [];
    private singleBuzzMode = false;
    private playerBroadCast = null;

    constructor(private connectionHandler: PlayerConnectionHandler) {
        this.buzzOrder = [];
    }

    playerBuzzed(player: Player, textInput: string) {
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
                this.connectionHandler.getAdminSocket().emit('sde-player-buzzed', { ...data, 'textInput': textInput });
            }
        }
    }

    activateAll(buzzerType: BuzzerType) {
        this.buzzOrder = [];

        for (const p of this.connectionHandler.Players) {
            this.setBuzzerType(p, buzzerType);
            this.setBuzzerState(p, true);
            p.lastBuzzTime = null;
            console.log("player", p.name, "activated");
        }
    }

    deactivateAll(excludeId, sendWin = null) {
        for (const p of this.connectionHandler.Players) {
            if (p.id !== excludeId) {
                this.setBuzzerState(p, false, sendWin);
                p.lastBuzzTime = null;
                console.log("player", p.name, "deactivated");
            }
        }
    }

    setBuzzerType(player: Player, mode: BuzzerType): void {
        let emitEventName = "sde-player-buzztypebuzz";
        if (mode === BuzzerType.text) {
            emitEventName = "sde-player-buzztypetext"
        }

        this.connectionHandler
            .getSocketById(player.id)
            .emit(emitEventName);
    }

    setBuzzerState(player, state, win?) {
        player.canBuzz = state;
        //   if(socket.id === playerID) {
        this.connectionHandler.getSocketById(player.id)
            .emit("sde-player-buzzstatechange", { enabled: state, win: win });
    }
}