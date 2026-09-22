import { TileType } from './TileType';
import { SpecialType } from './SpecialType';

export interface TileData {
    id: number;
    name: string;
    type: TileType;

    price?: number;
    baseRent?: number;
    taxAmount?: number;
    ownerId?: number | null;

    // SPECIAL / TRANSPORT data
    specialType?: SpecialType;
    travelCost?: number;
    destinationTileIndices?: number[];
}
