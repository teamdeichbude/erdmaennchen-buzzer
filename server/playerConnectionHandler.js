const { Player: Player } = require("./player.js");

class PlayerConnectionHandler
{

    constructor()
    {
        this._players = [];
    }

    get Players()
    {
        return this._players;
    };

    getPlayerById(id)
    {
        return this._players.filter(function (item)
        {
            return item.id === id;
        });
    }

    connectPlayer(playerId, playerName, playerAudioIdent)
    {
        let exisitingPlayer = this.getPlayerById(playerId);
        if (exisitingPlayer.length > 0)
        {
            console.error("player with id ", playerId, " already exists under the name:", exisitingPlayer[0].name);
            return false;
        }

        let player = new Player(playerId, playerName, playerAudioIdent);
        this._players.push(player);
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
