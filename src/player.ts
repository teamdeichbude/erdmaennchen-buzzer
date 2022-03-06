export class Player {
    public name: string;
    public soundIdent: string;
    public id: string;
    public canBuzz: boolean;
    public lastBuzzTime: number = -1;

    constructor(id, name, soundIdent, canBuzz = false) {
        this.name = name;
        this.soundIdent = soundIdent;
        this.id = id;
        this.canBuzz = canBuzz;
    }
}