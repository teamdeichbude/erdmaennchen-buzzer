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
            console.error("player cant buzz before being connected properly. Please connect with valid name first.");
        }
        if (player.canBuzz)
        {
            this.setBuzzerState(player, false);
            player.lastBuzzTime = Date.now();
            this._buzzOrder.push(player);
            console.log("player", player.name, "buzzed at", player.lastBuzzTime);
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

    setBuzzerState(player, state)
    {
        player.canBuzz = state;
        //   if(socket.id === playerID) {
        this.ConnectionHandler.getSocketById(player.id)
        .emit("sde-player-buzzstatechange", { enabled: state , win: null});
    }
}

module.exports.BuzzerController = BuzzerController;