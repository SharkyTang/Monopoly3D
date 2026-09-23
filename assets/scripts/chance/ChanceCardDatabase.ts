import { ChanceCardData } from './ChanceCardData';
import { ChanceCardType } from './ChanceCardType';

export const CHANCE_CARD_DATABASE: ChanceCardData[] = [

    {
        id: 1,
        title: 'Tourist Bonus',
        description: 'Receive 800.',
        type: ChanceCardType.MONEY_GAIN,
        amount: 800,
    },

    {
        id: 2,
        title: 'Street Festival',
        description: 'Receive 500.',
        type: ChanceCardType.MONEY_GAIN,
        amount: 500,
    },

    {
        id: 3,
        title: 'Lucky Day',
        description: 'Receive 1200.',
        type: ChanceCardType.MONEY_GAIN,
        amount: 1200,
    },

    {
        id: 4,
        title: 'Cashback',
        description: 'Receive 600.',
        type: ChanceCardType.MONEY_GAIN,
        amount: 600,
    },

    {
        id: 5,
        title: 'Parking Fine',
        description: 'Pay 500.',
        type: ChanceCardType.MONEY_LOSS,
        amount: 500,
    },

    {
        id: 6,
        title: 'Lost Wallet',
        description: 'Pay 600.',
        type: ChanceCardType.MONEY_LOSS,
        amount: 600,
    },

    {
        id: 7,
        title: 'Hotel Charge',
        description: 'Pay 800.',
        type: ChanceCardType.MONEY_LOSS,
        amount: 800,
    },

    {
        id: 8,
        title: 'Taxi Ride',
        description: 'Move forward 3 tiles.',
        type: ChanceCardType.MOVE,
        moveSteps: 3,
    },

    {
        id: 9,
        title: 'Express Train',
        description: 'Move forward 4 tiles.',
        type: ChanceCardType.MOVE,
        moveSteps: 4,
    },

    {
        id: 10,
        title: 'Wrong Train',
        description: 'Move backward 2 tiles.',
        type: ChanceCardType.MOVE,
        moveSteps: -2,
    },

    {
        id: 11,
        title: 'Detour',
        description: 'Move backward 3 tiles.',
        type: ChanceCardType.MOVE,
        moveSteps: -3,
    },

    {
        id: 12,
        title: 'Airport Transfer',
        description: 'Move forward to the next Airport.',
        type: ChanceCardType.MOVE_TO_NEXT_AIRPORT,
    },

];
