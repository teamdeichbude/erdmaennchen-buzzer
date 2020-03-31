class Player
{
    constructor(id, name, soundIdent)
    {
        this.name = name;
        this.soundIdent = soundIdent;
        this._id = id;
    }

    get id()
    {
        return this._id;
    }

    
}

module.exports.Player = Player;