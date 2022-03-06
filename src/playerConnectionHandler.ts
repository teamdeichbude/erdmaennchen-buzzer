import { Socket } from 'socket.io';
import { BuzzerType } from './buzzerType';
import { Player } from './player';

export class PlayerConnectionHandler {
    private players: Player[];
    private sockets: Socket[];
    private admin: Socket;

    constructor() {
        this.players = [];
        this.sockets = [];
        this.admin = null;
    }

    get Players() {
        return this.players;
    }

    addSocket(socket: Socket): void {
        this.sockets.push(socket);
    }

    addAdmin(socket: Socket) {
        this.admin = socket;
    }

    getSocketById(id: string): Socket {
        return this.sockets.find(function (item) {
            return item.id === id;
        });
    }

    getPlayerById(id: string): Player {
        return this.players.find(function (item) {
            return item.id === id;
        });
    }

    getAdminSocket(): Socket {
        return this.admin;
    }

    connectPlayer(
        playerId: string,
        playerName: string,
        playerAudioIdent: string,
        buzzerActive: boolean,
        buzzerType: BuzzerType,
    ) {
        const exisitingPlayer = this.getPlayerById(playerId);
        if (exisitingPlayer) {
            throw new Error('player with id ' + playerId + ' already exists under the name:' + exisitingPlayer.name);
        }

        const player = new Player(playerId, playerName, playerAudioIdent, buzzerActive);
        this.players.push(player);

        this.getSocketById(player.id).emit('sde-player-buzzstatechange', { enabled: buzzerActive, win: null });
        if (buzzerType === BuzzerType.text) {
            this.getSocketById(player.id).emit('sde-player-buzztypetext');
        }
    }

    disconnectPlayer(playerId: string): void {
        this.players = this.players.filter(function (item) {
            return item.id !== playerId;
        });
    }
}