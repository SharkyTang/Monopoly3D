import { _decorator, Component } from 'cc';
import { PlayerEconomyData } from '../player/PlayerEconomyData';

const { ccclass, property } = _decorator;

@ccclass('EconomySystem')
export class EconomySystem extends Component {

    @property([PlayerEconomyData])
    players: PlayerEconomyData[] = [];

    protected start(): void {

        console.log(
            `[EconomySystem] Ready. Registered players: ${this.players.length}`
        );

        for (let playerId = 0; playerId < this.players.length; playerId++) {

            const player = this.getPlayerById(playerId);

            if (!player) {
                continue;
            }

            console.log(
                `[EconomySystem] Lookup playerId=${playerId} -> ${player.node.name}, money=${player.money}`
            );
        }
    }

    public getPlayerById(
        playerId: number
    ): PlayerEconomyData | null {

        const player = this.players.find(
            (playerData) =>
                playerData !== null &&
                playerData.playerId === playerId
        );

        if (!player) {

            console.error(
                `[EconomySystem] No player found with playerId=${playerId}.`
            );

            return null;
        }

        return player;
    }

    public addMoney(
        playerId: number,
        amount: number
    ): void {

        if (amount <= 0) {

            console.error(
                `[EconomySystem] addMoney amount must be greater than 0. Received: ${amount}`
            );

            return;
        }

        const player = this.getPlayerById(playerId);

        if (!player) {
            return;
        }

        const moneyBefore = player.money;

        player.money += amount;

        console.log(
            `[EconomySystem] addMoney: ${player.node.name} ${moneyBefore} + ${amount} = ${player.money}`
        );
    }

    public removeMoney(
        playerId: number,
        amount: number
    ): void {

        if (amount <= 0) {

            console.error(
                `[EconomySystem] removeMoney amount must be greater than 0. Received: ${amount}`
            );

            return;
        }

        const player = this.getPlayerById(playerId);

        if (!player) {
            return;
        }

        const moneyBefore = player.money;

        player.money -= amount;

        console.log(
            `[EconomySystem] removeMoney: ${player.node.name} ${moneyBefore} - ${amount} = ${player.money}`
        );
    }
}