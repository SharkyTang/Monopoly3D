import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PlayerJailData')
export class PlayerJailData extends Component {

    @property({
        tooltip: 'Whether this player is currently in jail.'
    })
    isInJail: boolean = false;

    @property({
        tooltip: 'Number of jail turns currently recorded for this player.'
    })
    jailTurns: number = 0;

    protected start(): void {
        console.log(
            `[PlayerJailData] ${this.node.name} -> isInJail = ${this.isInJail}, jailTurns = ${this.jailTurns}`
        );
    }
}

