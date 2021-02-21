/*eslint-env node */


const dateFormat = require('dateformat');

class BuzzerController
{
    constructor(connectionHandler)
    {
        this.ConnectionHandler = connectionHandler;
        this._buzzOrder = [];
        this.singleBuzzMode = false;
        this.playerBroadCast = null;
    }

    playerBuzzed(player, textInput)
    {
        if (!player)
        {
            throw new Error("player cant buzz before being connected properly. Please connect with valid name first.");
        }
        if (player.canBuzz)
        {
            let win = this._buzzOrder.length === 0;
            this.setBuzzerState(player, false, win);
            if (this.singleBuzzMode)
            {
                this.deactivateAll(player.id, false);
            }
            player.lastBuzzTime = Date.now();
            this._buzzOrder.push(player);
            if (this.playerBroadCast)
            {
                let data = { player: player, isFirstBuzz: win, time: player.lastBuzzTime, formattedTime: dateFormat(player.lastBuzzTime, "H:MM:ss.l") };
                this.playerBroadCast.emit("sde-player-buzzed", data);
                this.ConnectionHandler.getAdminSocket().emit('sde-player-buzzed', {...data, 'textInput': textInput});
            }
        }
    }
  
    activateAll(buzzerType)
    {
        this._buzzOrder = [];

        for (let p of this.ConnectionHandler.Players)
        {
            this.setBuzzerType(p, buzzerType);
            this.setBuzzerState(p, true);
            p.lastBuzzTime = null;
            console.log("player", p.name, "activated");
        }
    }

    deactivateAll(excludeId, sendWin = null)
    {
        for (let p of this.ConnectionHandler.Players)
        {
            if (p.id !== excludeId)
            {
                this.setBuzzerState(p, false, sendWin);
                p.lastBuzzTime = null;
                console.log("player", p.name, "deactivated");
            }
        }
    }

    setBuzzerType(player, mode) {
        let emitEventName = "sde-player-buzztypebuzz";
        if (mode === 'buzzerTypeText') {
            emitEventName = "sde-player-buzztypetext"
        }

        this.ConnectionHandler
            .getSocketById(player.id)
            .emit(emitEventName);
    }

    setBuzzerState(player, state, win)
    {
        player.canBuzz = state;
        //   if(socket.id === playerID) {
        this.ConnectionHandler.getSocketById(player.id)
            .emit("sde-player-buzzstatechange", { enabled: state, win: win });
    }
}

module.exports.BuzzerController = BuzzerController;