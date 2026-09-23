import { ChanceCardData } from './ChanceCardData';
import { ChanceCardType } from './ChanceCardType';

export const CHANCE_CARD_DATABASE: ChanceCardData[] = [

    {
        id: 1,
        title: 'Lucky Bonus',
        description: 'Receive 1000.',
        type: ChanceCardType.MONEY_GAIN,
        amount: 1000,
    },

    {
        id: 2,
        title: 'Big Prize',
        description: 'Receive 2000.',
        type: ChanceCardType.MONEY_GAIN,
        amount: 2000,
    },

    {
        id: 3,
        title: 'Repair Fee',
        description: 'Pay 500.',
        type: ChanceCardType.MONEY_LOSS,
        amount: 500,
    },

    {
        id: 4,
        title: 'Unexpected Expense',
        description: 'Pay 1000.',
        type: ChanceCardType.MONEY_LOSS,
        amount: 1000,
    },

    {
        id: 5,
        title: 'Move Forward',
        description: 'Move forward 3 tiles.',
        type: ChanceCardType.MOVE,
        moveSteps: 3,
    },

    {
        id: 6,
        title: 'Move Backward',
        description: 'Move backward 2 tiles.',
        type: ChanceCardType.MOVE,
        moveSteps: -2,
    },

];
