"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(id, name, soundIdent, canBuzz = false) {
        this.lastBuzzTime = -1;
        this.name = name;
        this.soundIdent = soundIdent;
        this.id = id;
        this.canBuzz = canBuzz;
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map