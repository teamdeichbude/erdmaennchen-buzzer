/*eslint-env node*/

const { Player: Player } = require("./player.js");

class PlayerConnectionHandler
{

    constructor()
    {
        this._players = [];
        this._sockets = [];
        this._admin = null;
    }

    get Players()
    {
        return this._players;
    };

    addSocket(socket)
    {
        this._sockets.push(socket);
    }

    addAdmin(socket)
    {
        this._admin = socket;
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

    getAdminSocket()
    {
        return this._admin;
    }

    connectPlayer(playerId, playerName, playerAudioIdent, buzzerActive, buzzerType)
    {
        let exisitingPlayer = this.getPlayerById(playerId);
        if (exisitingPlayer)
        {
            throw new Error("player with id " + playerId + " already exists under the name:" + exisitingPlayer.name);
        }

        let player = new Player(playerId, playerName, playerAudioIdent, buzzerActive);
        this._players.push(player);

        this.getSocketById(player.id)
            .emit("sde-player-buzzstatechange", { enabled: buzzerActive, win: null});
        if (buzzerType === 'text') {
            this.getSocketById(player.id).emit("sde-player-buzztypetext");
        }
    }

    disconnectPlayer(playerId)
    {
        this._players = this._players.filter(function (item)
        {
            return item.id !== playerId;
        });
    }
}

module.exports.PlayerConnectionHandler = PlayerConnectionHandler;
