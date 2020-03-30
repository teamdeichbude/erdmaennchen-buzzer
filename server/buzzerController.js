
const dateFormat = require('dateformat');

class BuzzerController
{
    constructor(connectionHandler)
    {
        this.ConnectionHandler = connectionHandler;
        this._buzzOrder = [];
    }

    playerBuzzed(player)
    {
        if(!player) {
            throw new Error("player cant buzz before being connected properly. Please connect with valid name first.")
        }
        if (player.canBuzz)
        {
            let win = this._buzzOrder.length === 0;
            this.setBuzzerState(player, false, win);
            player.lastBuzzTime = Date.now();
            this._buzzOrder.push(player);
            console.log("player", player.name, "buzzed at", player.lastBuzzTime);
            if(this.BroadcastSocket) {
                this.BroadcastSocket.emit("sde-player-buzzed", {player: player, time: player.lastBuzzTime, formattedTime: dateFormat(player.lastBuzzTime,"H:MM:ss.l")});
            }
        }
    }

    activateAll()
    {
        this._buzzOrder = [];

        for (let p of this.ConnectionHandler.Players)
        {
            this.setBuzzerState(p, true);
            p.lastBuzzTime = null;
            console.log("player", p.name, "activated");
        }
    }

    setBuzzerState(player, state, win)
    {
        player.canBuzz = state;
        //   if(socket.id === playerID) {
        this.ConnectionHandler.getSocketById(player.id)
        .emit("sde-player-buzzstatechange", { enabled: state , win: win});
    }
}

module.exports.BuzzerController = BuzzerController;