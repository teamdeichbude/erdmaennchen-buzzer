/*eslint-env node */

class Player
{
    constructor(id, name, soundIdent, canBuzz = false)
    {
        this.name = name;
        this.soundIdent = soundIdent;
        this._id = id;
        this.canBuzz = canBuzz;
    }

    get id()
    {
        return this._id;
    }
}

module.exports.Player = Player;