import { ChanceCardType } from './ChanceCardType';

export interface ChanceCardData {
    id: number;

    title: string;

    description: string;

    type: ChanceCardType;

    amount?: number;

    moveSteps?: number;
}