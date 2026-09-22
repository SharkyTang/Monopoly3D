import { TileData } from './TileData';
import { TileType } from './TileType';
import { SpecialType } from './SpecialType';

export const TILE_DATABASE: TileData[] = [
    {
        id: 0,
        name: 'Start',
        type: TileType.START
    },

    {
        id: 1,
        name: 'Paris',
        type: TileType.PROPERTY,
        price: 1600,
        baseRent: 200,
        ownerId: null
    },

    {
        id: 2,
        name: 'Chance',
        type: TileType.CHANCE
    },

    {
        id: 3,
        name: 'Destiny',
        type: TileType.DESTINY
    },

    {
        id: 4,
        name: 'Tax',
        type: TileType.TAX,
        taxAmount: 1000
    },

    {
        id: 5,
        name: 'Jail',
        type: TileType.JAIL
    },

    {
        id: 6,
        name: 'Airport',
        type: TileType.SPECIAL,
        specialType: SpecialType.TRANSPORT,
        travelCost: 500,
        destinationTileIndices: [1]
    },

    {
        id: 7,
        name: 'Go To Jail',
        type: TileType.GO_TO_JAIL
    },

    {
        id: 8,
        name: 'Free Parking',
        type: TileType.FREE_PARKING
    }
];