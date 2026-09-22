import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PlayerEconomyData')
export class PlayerEconomyData extends Component {

    @property({
        tooltip: 'Unique ID for this player.'
    })
    playerId: number = 0;

    @property({
        tooltip: 'Current money owned by this player.'
    })
    money: number = 15000;

    protected start(): void {
        console.log(
            `[PlayerEconomyData] ${this.node.name} -> playerId = ${this.playerId}, money = ${this.money}`
        );
    }
}
