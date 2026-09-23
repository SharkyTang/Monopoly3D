import { TileType } from './TileType';
import { SpecialType } from './SpecialType';
import { PropertyGroup } from './PropertyGroup';

export interface TileData {
    id: number;
    name: string;
    type: TileType;

    price?: number;
    baseRent?: number;
    taxAmount?: number;
    ownerId?: number | null;
    propertyGroup?: PropertyGroup;

    // SPECIAL / TRANSPORT data
    specialType?: SpecialType;
    travelCost?: number;
    destinationTileIndices?: number[];
}