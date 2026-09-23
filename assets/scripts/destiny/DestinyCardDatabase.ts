import { DestinyCardData } from './DestinyCardData';
import { DestinyCardType } from './DestinyCardType';

export const DESTINY_CARD_DATABASE: DestinyCardData[] = [
    {
        id: 1,
        title: 'Major Investment Return',
        description: 'Receive 3000.',
        type: DestinyCardType.MONEY_GAIN,
        amount: 3000,
    },
    {
        id: 2,
        title: 'Global Sponsorship',
        description: 'Receive 2000.',
        type: DestinyCardType.MONEY_GAIN,
        amount: 2000,
    },
    {
        id: 3,
        title: 'Market Crash',
        description: 'Pay 2000.',
        type: DestinyCardType.MONEY_LOSS,
        amount: 2000,
    },
    {
        id: 4,
        title: 'Emergency Expense',
        description: 'Pay 1500.',
        type: DestinyCardType.MONEY_LOSS,
        amount: 1500,
    },
    {
        id: 5,
        title: 'Everyone Pays You',
        description: 'Each other player pays you 500.',
        type: DestinyCardType.COLLECT_FROM_OTHERS,
        amount: 500,
    },
    {
        id: 6,
        title: 'Pay Everyone',
        description: 'Pay each other player 500.',
        type: DestinyCardType.PAY_OTHERS,
        amount: 500,
    },
    {
        id: 7,
        title: 'Global Bonus',
        description: 'Every player receives 500.',
        type: DestinyCardType.ALL_GAIN,
        amount: 500,
    },
    {
        id: 8,
        title: 'Global Fee',
        description: 'Every player pays 500.',
        type: DestinyCardType.ALL_LOSS,
        amount: 500,
    },
    {
        id: 9,
        title: 'Go To Jail',
        description: 'Move directly to Jail.',
        type: DestinyCardType.GO_TO_JAIL,
    },
    {
        id: 10,
        title: 'Return To START',
        description: 'Move forward to START and receive the START reward.',
        type: DestinyCardType.RETURN_TO_START,
    },
    {
        id: 11,
        title: 'Advance',
        description: 'Move forward 6 tiles.',
        type: DestinyCardType.MOVE,
        moveSteps: 6,
    },
    {
        id: 12,
        title: 'Backward Fate',
        description: 'Move backward 4 tiles.',
        type: DestinyCardType.MOVE,
        moveSteps: -4,
    },
];
