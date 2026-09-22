import { _decorator, Component } from 'cc';
import { PlayerController } from '../player/PlayerController';
import { PlayerJailData } from '../jail/PlayerJailData';

const { ccclass, property } = _decorator;

@ccclass('TurnManager')
export class TurnManager extends Component {

    @property([PlayerController])
    players: PlayerController[] = [];

    private currentPlayerIndex: number = 0;

    start() {
        if (this.players.length === 0) {
            console.error('[TurnManager] No players assigned.');
            return;
        }

        console.log(
            `[TurnManager] Game starts. Current player: ${this.getCurrentPlayer().node.name}`
        );
    }

    public getCurrentPlayer(): PlayerController {
        return this.players[this.currentPlayerIndex];
    }

    public getCurrentPlayerIndex(): number {
        return this.currentPlayerIndex;
    }

    public nextTurn(): void {
        if (this.players.length === 0) {
            return;
        }

        this.currentPlayerIndex =
            (this.currentPlayerIndex + 1) % this.players.length;

        const nextPlayer =
            this.getCurrentPlayer();

        const playerJailData =
            nextPlayer.getComponent(PlayerJailData);

        if (
            playerJailData &&
            playerJailData.isInJail
        ) {

            playerJailData.jailTurns += 1;

            console.log(
                `[JailSystem] ${nextPlayer.node.name} skips this turn because they are in JAIL.`
            );

            console.log(
                `[JailSystem] ${nextPlayer.node.name} jailTurns = ${playerJailData.jailTurns}.`
            );

            // v0.1 rule:
            // A jailed player skips exactly one turn, then is automatically released.
            playerJailData.isInJail = false;
            playerJailData.jailTurns = 0;

            console.log(
                `[JailSystem] ${nextPlayer.node.name} served 1 skipped turn and is now released from JAIL.`
            );

            console.log(
                `[JailSystem] State updated: isInJail=${playerJailData.isInJail}, jailTurns=${playerJailData.jailTurns}.`
            );

            // Continue immediately to the next eligible player.
            // If multiple jailed players are consecutive, each one is skipped
            // and released in turn until a playable player is reached.
            this.nextTurn();
            return;
        }

        console.log(
            `[TurnManager] Next turn: ${nextPlayer.node.name}`
        );
    }
}
