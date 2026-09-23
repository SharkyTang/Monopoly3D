import { TileData } from './TileData';
import { TileType } from './TileType';
import { SpecialType } from './SpecialType';
import { PropertyGroup } from './PropertyGroup';

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
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_1
    },
    {
        id: 2,
        name: 'London',
        type: TileType.PROPERTY,
        price: 1800,
        baseRent: 230,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_1
    },
    {
        id: 3,
        name: 'Chance',
        type: TileType.CHANCE
    },
    {
        id: 4,
        name: 'Barcelona',
        type: TileType.PROPERTY,
        price: 2000,
        baseRent: 260,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_1
    },
    {
        id: 5,
        name: 'Rome',
        type: TileType.PROPERTY,
        price: 2200,
        baseRent: 300,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_2
    },
    {
        id: 6,
        name: 'Airport West',
        type: TileType.SPECIAL,
        specialType: SpecialType.TRANSPORT,
        travelCost: 500,
        destinationTileIndices: [1, 12, 26]
    },
    {
        id: 7,
        name: 'Athens',
        type: TileType.PROPERTY,
        price: 2500,
        baseRent: 340,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_2
    },
    {
        id: 8,
        name: 'Free Parking',
        type: TileType.FREE_PARKING
    },
    {
        id: 9,
        name: 'Istanbul',
        type: TileType.PROPERTY,
        price: 2800,
        baseRent: 390,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_2
    },
    {
        id: 10,
        name: 'Cairo',
        type: TileType.PROPERTY,
        price: 3000,
        baseRent: 430,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_3
    },
    {
        id: 11,
        name: 'Destiny',
        type: TileType.DESTINY
    },
    {
        id: 12,
        name: 'Dubai',
        type: TileType.PROPERTY,
        price: 3400,
        baseRent: 480,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_3
    },
    {
        id: 13,
        name: 'Tax',
        type: TileType.TAX,
        taxAmount: 1000
    },
    {
        id: 14,
        name: 'Casablanca',
        type: TileType.PROPERTY,
        price: 3800,
        baseRent: 540,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_3
    },
    {
        id: 15,
        name: 'Chance',
        type: TileType.CHANCE
    },
    {
        id: 16,
        name: 'Jail',
        type: TileType.JAIL
    },
    {
        id: 17,
        name: 'Singapore',
        type: TileType.PROPERTY,
        price: 4000,
        baseRent: 580,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_4
    },
    {
        id: 18,
        name: 'Kuala Lumpur',
        type: TileType.PROPERTY,
        price: 4500,
        baseRent: 650,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_4
    },
    {
        id: 19,
        name: 'Destiny',
        type: TileType.DESTINY
    },
    {
        id: 20,
        name: 'Sydney',
        type: TileType.PROPERTY,
        price: 5000,
        baseRent: 730,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_4
    },
    {
        id: 21,
        name: 'Tokyo',
        type: TileType.PROPERTY,
        price: 5200,
        baseRent: 780,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_5
    },
    {
        id: 22,
        name: 'Airport East',
        type: TileType.SPECIAL,
        specialType: SpecialType.TRANSPORT,
        travelCost: 500,
        destinationTileIndices: [25, 21, 17]
    },
    {
        id: 23,
        name: 'Seoul',
        type: TileType.PROPERTY,
        price: 5800,
        baseRent: 880,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_5
    },
    {
        id: 24,
        name: 'Go To Jail',
        type: TileType.GO_TO_JAIL
    },
    {
        id: 25,
        name: 'Shanghai',
        type: TileType.PROPERTY,
        price: 6400,
        baseRent: 980,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_5
    },
    {
        id: 26,
        name: 'New York',
        type: TileType.PROPERTY,
        price: 6800,
        baseRent: 1050,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_6
    },
    {
        id: 27,
        name: 'Chance',
        type: TileType.CHANCE
    },
    {
        id: 28,
        name: 'San Francisco',
        type: TileType.PROPERTY,
        price: 7600,
        baseRent: 1180,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_6
    },
    {
        id: 29,
        name: 'Tax',
        type: TileType.TAX,
        taxAmount: 1000
    },
    {
        id: 30,
        name: 'Rio de Janeiro',
        type: TileType.PROPERTY,
        price: 8400,
        baseRent: 1350,
        ownerId: null,
        propertyGroup: PropertyGroup.GROUP_6
    },
    {
        id: 31,
        name: 'Destiny',
        type: TileType.DESTINY
    }
];
