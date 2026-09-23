import { DestinyCardData } from './DestinyCardData';
import { DestinyCardType } from './DestinyCardType';

export const DESTINY_CARD_DATABASE: DestinyCardData[] = [

    {
        id: 1,
        title: 'Great Fortune',
        description: 'Destiny brings you a major fortune. Receive 3000.',
        type: DestinyCardType.MONEY_GAIN,
        amount: 3000,
    },

    {
        id: 2,
        title: 'Jackpot',
        description: 'A life-changing opportunity appears. Receive 5000.',
        type: DestinyCardType.MONEY_GAIN,
        amount: 5000,
    },

    {
        id: 3,
        title: 'Major Setback',
        description: 'A major setback strikes. Lose 2000.',
        type: DestinyCardType.MONEY_LOSS,
        amount: 2000,
    },

    {
        id: 4,
        title: 'Financial Crisis',
        description: 'A financial crisis hits unexpectedly. Lose 3000.',
        type: DestinyCardType.MONEY_LOSS,
        amount: 3000,
    },

    {
        id: 5,
        title: 'Destiny Advances',
        description: 'Destiny pushes you far ahead. Move forward 5 tiles.',
        type: DestinyCardType.MOVE,
        moveSteps: 5,
    },

    {
        id: 6,
        title: 'Destiny Reverses',
        description: 'Destiny turns against you. Move backward 4 tiles.',
        type: DestinyCardType.MOVE,
        moveSteps: -4,
    },

];

