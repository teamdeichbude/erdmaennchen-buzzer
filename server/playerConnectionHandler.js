const { Player: Player } = require("./player.js");

class PlayerConnectionHandler
{

    constructor()
    {
        this._players = [];
        this._sockets = [];
    }



    get Players()
    {
        return this._players;
    };

    addSocket(socket)
    {
        this._sockets.push(socket);
    }

    getSocketById(id)
    {
        return this._sockets.find(function (item)
        {
            return item.id === id;
        });
    }

    getPlayerById(id)
    {
        return this._players.find(function (item)
        {
            return item.id === id;
        });
    }

    connectPlayer(playerId, playerName, playerAudioIdent)
    {
        let exisitingPlayer = this.getPlayerById(playerId);
        if (exisitingPlayer)
        {
            throw new Error("player with id " + playerId + " already exists under the name:" + exisitingPlayer.name);
        }

        let player = new Player(playerId, playerName, playerAudioIdent);
        this._players.push(player);

        //init player with disabled buzzer
        this.getSocketById(player.id)
            .emit("sde-player-buzzstatechange", { enabled: false, win: null });
        console.log("player added");
    }

    disconnectPlayer(playerId)
    {
        this._players = this._players.filter(function (item)
        {
            return item.id !== playerId;
        });
        console.log('user disconnected');
    }
}

module.exports.PlayerConnectionHandler = PlayerConnectionHandler;
