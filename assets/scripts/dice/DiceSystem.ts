import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

export interface DiceResult {
    die1: number;
    die2: number;
    total: number;
}

@ccclass('DiceSystem')
export class DiceSystem extends Component {

    public roll(): DiceResult {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;

        const total = die1 + die2;

        console.log(
            `[DiceSystem] Rolled ${die1} + ${die2} = ${total}`
        );

        return {
            die1,
            die2,
            total
        };
    }
}