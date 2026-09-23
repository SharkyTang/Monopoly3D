import { DestinyCardType } from './DestinyCardType';

export interface DestinyCardData {

    id: number;

    title: string;

    description: string;

    type: DestinyCardType;

    amount?: number;

    moveSteps?: number;
}

