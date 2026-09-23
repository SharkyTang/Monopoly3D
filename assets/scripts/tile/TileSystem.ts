import { _decorator, Component } from 'cc';

import { PlayerController } from '../player/PlayerController';
import { PlayerEconomyData } from '../player/PlayerEconomyData';
import { PlayerJailData } from '../jail/PlayerJailData';
import { EconomySystem } from '../economy/EconomySystem';

import { CHANCE_CARD_DATABASE } from '../chance/ChanceCardDatabase';
import { ChanceCardType } from '../chance/ChanceCardType';

import { DESTINY_CARD_DATABASE } from '../destiny/DestinyCardDatabase';
import { DestinyCardType } from '../destiny/DestinyCardType';

import { TILE_DATABASE } from './TileDatabase';
import { TileType } from './TileType';
import { SpecialType } from './SpecialType';
import { TileData } from './TileData';

const { ccclass, property } = _decorator;

@ccclass('TileSystem')
export class TileSystem extends Component {

    @property(EconomySystem)
    economySystem: EconomySystem | null = null;

    private pendingProperty: TileData | null = null;

    private pendingChanceMoveSteps: number | null = null;

    private pendingDestinyMoveSteps: number | null = null;

    private pendingTransportDecision: TileData | null = null;

    private pendingGoToJailTargetTileIndex: number | null = null;

    public resolveLanding(
        player: PlayerController
    ): boolean {

        this.pendingProperty = null;
        this.pendingChanceMoveSteps = null;
        this.pendingDestinyMoveSteps = null;
        this.pendingTransportDecision = null;
        this.pendingGoToJailTargetTileIndex = null;

        const tileIndex =
            player.currentTileIndex;

        const tileData =
            TILE_DATABASE[tileIndex];

        if (!tileData) {

            console.error(
                `[TileSystem] No TileData found for tile index ${tileIndex}.`
            );

            return false;
        }

        console.log(
            `[TileSystem] ${player.node.name} landed on ${tileData.type}: ${tileData.name}`
        );

        // -------------------------------------------------
        // CHANCE Step 4C-3
        // Randomly draw one card.
        // MONEY_GAIN and MONEY_LOSS are executed.
        // MOVE FORWARD and MOVE BACKWARD are queued for GameManager.
        // -------------------------------------------------

        if (tileData.type === TileType.CHANCE) {

            console.log(
                `[ChanceSystem] ${player.node.name} landed on CHANCE: ${tileData.name}.`
            );

            if (CHANCE_CARD_DATABASE.length === 0) {

                console.error(
                    '[ChanceSystem] CHANCE_CARD_DATABASE is empty.'
                );

                return false;
            }

            const randomIndex =
                Math.floor(
                    Math.random() *
                    CHANCE_CARD_DATABASE.length
                );

            const drawnCard =
                CHANCE_CARD_DATABASE[randomIndex];

            console.log(
                `[ChanceSystem] Card drawn: id=${drawnCard.id}, title=${drawnCard.title}, type=${drawnCard.type}.`
            );

            console.log(
                `[ChanceSystem] Description: ${drawnCard.description}`
            );

            if (
                drawnCard.type ===
                ChanceCardType.MONEY_GAIN
            ) {

                if (drawnCard.amount === undefined) {

                    console.error(
                        `[ChanceSystem] MONEY_GAIN card ${drawnCard.title} does not have a valid amount.`
                    );

                    return false;
                }

                const playerEconomyData =
                    player.getComponent(PlayerEconomyData);

                if (!playerEconomyData) {

                    console.error(
                        `[ChanceSystem] ${player.node.name} has no PlayerEconomyData component.`
                    );

                    return false;
                }

                if (!this.economySystem) {

                    console.error(
                        '[ChanceSystem] EconomySystem is not assigned.'
                    );

                    return false;
                }

                const registeredPlayer =
                    this.economySystem.getPlayerById(
                        playerEconomyData.playerId
                    );

                if (!registeredPlayer) {

                    console.error(
                        `[ChanceSystem] Could not find playerId=${playerEconomyData.playerId}.`
                    );

                    return false;
                }

                const gainAmount =
                    drawnCard.amount;

                const moneyBefore =
                    registeredPlayer.money;

                console.log(
                    `[ChanceSystem] MONEY_GAIN amount: ${gainAmount}.`
                );

                this.economySystem.addMoney(
                    registeredPlayer.playerId,
                    gainAmount
                );

                console.log(
                    `[ChanceSystem] MONEY_GAIN APPLIED: ${player.node.name} received ${gainAmount}.`
                );

                console.log(
                    `[ChanceSystem] Money: ${moneyBefore} -> ${registeredPlayer.money}`
                );

                return false;
            }

            // ---------------------------------------------
            // MONEY_LOSS
            // ---------------------------------------------

            if (
                drawnCard.type ===
                ChanceCardType.MONEY_LOSS
            ) {

                if (drawnCard.amount === undefined) {

                    console.error(
                        `[ChanceSystem] MONEY_LOSS card ${drawnCard.title} does not have a valid amount.`
                    );

                    return false;
                }

                const playerEconomyData =
                    player.getComponent(PlayerEconomyData);

                if (!playerEconomyData) {

                    console.error(
                        `[ChanceSystem] ${player.node.name} has no PlayerEconomyData component.`
                    );

                    return false;
                }

                if (!this.economySystem) {

                    console.error(
                        '[ChanceSystem] EconomySystem is not assigned.'
                    );

                    return false;
                }

                const registeredPlayer =
                    this.economySystem.getPlayerById(
                        playerEconomyData.playerId
                    );

                if (!registeredPlayer) {

                    console.error(
                        `[ChanceSystem] Could not find playerId=${playerEconomyData.playerId}.`
                    );

                    return false;
                }

                const lossAmount =
                    drawnCard.amount;

                const moneyBefore =
                    registeredPlayer.money;

                console.log(
                    `[ChanceSystem] MONEY_LOSS amount: ${lossAmount}.`
                );

                this.economySystem.removeMoney(
                    registeredPlayer.playerId,
                    lossAmount
                );

                console.log(
                    `[ChanceSystem] MONEY_LOSS APPLIED: ${player.node.name} paid ${lossAmount}.`
                );

                console.log(
                    `[ChanceSystem] Money: ${moneyBefore} -> ${registeredPlayer.money}`
                );

                return false;
            }

            // ---------------------------------------------
            // MOVE Step 4C-3
            // Forward and backward movement are both queued.
            // GameManager waits for the movement to finish
            // and then resolves the new landing tile.
            // ---------------------------------------------

            if (
                drawnCard.type ===
                ChanceCardType.MOVE
            ) {

                if (drawnCard.moveSteps === undefined) {

                    console.error(
                        `[ChanceSystem] MOVE card ${drawnCard.title} does not have valid moveSteps.`
                    );

                    return false;
                }

                if (drawnCard.moveSteps === 0) {

                    console.error(
                        `[ChanceSystem] MOVE card ${drawnCard.title} has moveSteps=0.`
                    );

                    return false;
                }

                this.pendingChanceMoveSteps =
                    drawnCard.moveSteps;

                if (drawnCard.moveSteps > 0) {

                    console.log(
                        `[ChanceSystem] MOVE FORWARD queued: ${player.node.name} will move ${drawnCard.moveSteps} extra tiles.`
                    );

                } else {

                    console.log(
                        `[ChanceSystem] MOVE BACKWARD queued: ${player.node.name} will move ${Math.abs(drawnCard.moveSteps)} tiles backward.`
                    );
                }

                return false;
            }

            console.log(
                `[ChanceSystem] ${drawnCard.type} effect not executed yet.`
            );

            return false;
        }

        // -------------------------------------------------
        // DESTINY Step 4B
        // Randomly draw one card.
        // MONEY_GAIN and MONEY_LOSS are executed through EconomySystem.
        // MOVE FORWARD and MOVE BACKWARD are queued for GameManager.
        // No UI and no turn pause inside TileSystem.
        // -------------------------------------------------

        if (tileData.type === TileType.DESTINY) {

            console.log(
                `[DestinySystem] ${player.node.name} landed on DESTINY: ${tileData.name}.`
            );

            if (DESTINY_CARD_DATABASE.length === 0) {

                console.error(
                    '[DestinySystem] DESTINY_CARD_DATABASE is empty.'
                );

                return false;
            }

            const randomIndex =
                Math.floor(
                    Math.random() *
                    DESTINY_CARD_DATABASE.length
                );

            const drawnCard =
                DESTINY_CARD_DATABASE[randomIndex];

            console.log(
                `[DestinySystem] Card drawn: id=${drawnCard.id}, title=${drawnCard.title}, type=${drawnCard.type}.`
            );

            console.log(
                `[DestinySystem] Description: ${drawnCard.description}`
            );

            if (
                drawnCard.type ===
                DestinyCardType.MONEY_GAIN
            ) {

                if (drawnCard.amount === undefined) {

                    console.error(
                        `[DestinySystem] MONEY_GAIN card ${drawnCard.title} does not have a valid amount.`
                    );

                    return false;
                }

                const playerEconomyData =
                    player.getComponent(PlayerEconomyData);

                if (!playerEconomyData) {

                    console.error(
                        `[DestinySystem] ${player.node.name} has no PlayerEconomyData component.`
                    );

                    return false;
                }

                if (!this.economySystem) {

                    console.error(
                        '[DestinySystem] EconomySystem is not assigned.'
                    );

                    return false;
                }

                const registeredPlayer =
                    this.economySystem.getPlayerById(
                        playerEconomyData.playerId
                    );

                if (!registeredPlayer) {

                    console.error(
                        `[DestinySystem] Could not find playerId=${playerEconomyData.playerId}.`
                    );

                    return false;
                }

                const gainAmount =
                    drawnCard.amount;

                const moneyBefore =
                    registeredPlayer.money;

                console.log(
                    `[DestinySystem] MONEY_GAIN amount: ${gainAmount}.`
                );

                this.economySystem.addMoney(
                    registeredPlayer.playerId,
                    gainAmount
                );

                console.log(
                    `[DestinySystem] MONEY_GAIN APPLIED: ${player.node.name} received ${gainAmount}.`
                );

                console.log(
                    `[DestinySystem] Money: ${moneyBefore} -> ${registeredPlayer.money}`
                );

                return false;
            }

            // ---------------------------------------------
            // MONEY_LOSS
            // ---------------------------------------------

            if (
                drawnCard.type ===
                DestinyCardType.MONEY_LOSS
            ) {

                if (drawnCard.amount === undefined) {

                    console.error(
                        `[DestinySystem] MONEY_LOSS card ${drawnCard.title} does not have a valid amount.`
                    );

                    return false;
                }

                const playerEconomyData =
                    player.getComponent(PlayerEconomyData);

                if (!playerEconomyData) {

                    console.error(
                        `[DestinySystem] ${player.node.name} has no PlayerEconomyData component.`
                    );

                    return false;
                }

                if (!this.economySystem) {

                    console.error(
                        '[DestinySystem] EconomySystem is not assigned.'
                    );

                    return false;
                }

                const registeredPlayer =
                    this.economySystem.getPlayerById(
                        playerEconomyData.playerId
                    );

                if (!registeredPlayer) {

                    console.error(
                        `[DestinySystem] Could not find playerId=${playerEconomyData.playerId}.`
                    );

                    return false;
                }

                const lossAmount =
                    drawnCard.amount;

                const moneyBefore =
                    registeredPlayer.money;

                console.log(
                    `[DestinySystem] MONEY_LOSS amount: ${lossAmount}.`
                );

                this.economySystem.removeMoney(
                    registeredPlayer.playerId,
                    lossAmount
                );

                console.log(
                    `[DestinySystem] MONEY_LOSS APPLIED: ${player.node.name} paid ${lossAmount}.`
                );

                console.log(
                    `[DestinySystem] Money: ${moneyBefore} -> ${registeredPlayer.money}`
                );

                return false;
            }

            // ---------------------------------------------
            // MOVE — DESTINY Step 4B
            // Positive and negative Destiny MOVE are both queued.
            // GameManager performs the asynchronous movement
            // and resolves the landing tile afterwards.
            // ---------------------------------------------

            if (
                drawnCard.type ===
                DestinyCardType.MOVE
            ) {

                if (drawnCard.moveSteps === undefined) {

                    console.error(
                        `[DestinySystem] MOVE card ${drawnCard.title} does not have valid moveSteps.`
                    );

                    return false;
                }

                if (drawnCard.moveSteps === 0) {

                    console.error(
                        `[DestinySystem] MOVE card ${drawnCard.title} has moveSteps=0.`
                    );

                    return false;
                }

                this.pendingDestinyMoveSteps =
                    drawnCard.moveSteps;

                if (drawnCard.moveSteps > 0) {

                    console.log(
                        `[DestinySystem] MOVE FORWARD queued: ${player.node.name} will move ${drawnCard.moveSteps} extra tiles.`
                    );

                } else {

                    console.log(
                        `[DestinySystem] MOVE BACKWARD queued: ${player.node.name} will move ${Math.abs(drawnCard.moveSteps)} tiles backward.`
                    );
                }

                return false;
            }

            console.log(
                `[DestinySystem] ${drawnCard.type} effect not executed yet.`
            );

            return false;
        }

        // -------------------------------------------------
        // TAX Step 2
        // Read tax amount from TileData and deduct through
        // EconomySystem.
        // -------------------------------------------------

        if (tileData.type === TileType.TAX) {

            console.log(
                `[TaxSystem] ${player.node.name} landed on TAX: ${tileData.name}.`
            );

            if (tileData.taxAmount === undefined) {

                console.error(
                    `[TaxSystem] ${tileData.name} does not have a valid taxAmount.`
                );

                return false;
            }

            const playerEconomyData =
                player.getComponent(PlayerEconomyData);

            if (!playerEconomyData) {

                console.error(
                    `[TaxSystem] ${player.node.name} has no PlayerEconomyData component.`
                );

                return false;
            }

            if (!this.economySystem) {

                console.error(
                    '[TaxSystem] EconomySystem is not assigned.'
                );

                return false;
            }

            const registeredPlayer =
                this.economySystem.getPlayerById(
                    playerEconomyData.playerId
                );

            if (!registeredPlayer) {

                console.error(
                    `[TaxSystem] Could not find playerId=${playerEconomyData.playerId}.`
                );

                return false;
            }

            const taxAmount =
                tileData.taxAmount;

            const moneyBefore =
                registeredPlayer.money;

            console.log(
                `[TaxSystem] Tax amount: ${taxAmount}.`
            );

            this.economySystem.removeMoney(
                registeredPlayer.playerId,
                taxAmount
            );

            console.log(
                `[TaxSystem] TAX PAID: ${player.node.name} paid ${taxAmount}.`
            );

            console.log(
                `[TaxSystem] Money: ${moneyBefore} -> ${registeredPlayer.money}`
            );

            return false;
        }

        // -------------------------------------------------
        // GO_TO_JAIL Step 2
        // Queue a direct forced move to the existing JAIL tile.
        // GameManager owns the asynchronous movement.
        // Jail state is intentionally NOT changed in this step.
        // -------------------------------------------------
        if (tileData.type === TileType.GO_TO_JAIL) {

            console.log(
                `[GoToJailSystem] ${player.node.name} landed on GO_TO_JAIL: ${tileData.name}.`
            );

            const jailTileIndex =
                TILE_DATABASE.findIndex(
                    (tile) =>
                        tile.type ===
                        TileType.JAIL
                );

            if (jailTileIndex < 0) {

                console.error(
                    '[GoToJailSystem] No JAIL tile exists in TILE_DATABASE.'
                );

                return false;
            }

            this.pendingGoToJailTargetTileIndex =
                jailTileIndex;

            console.log(
                `[GoToJailSystem] Forced move queued: ${player.node.name} -> Tile_${jailTileIndex
                    .toString()
                    .padStart(2, '0')}.`
            );

            console.log(
                '[GoToJailSystem] Forced move queued. Jail state will be resolved after arrival.'
            );

            return false;
        }

        // -------------------------------------------------
        // JAIL Step 2B
        // Enter Jail state only.
        // -------------------------------------------------
        if (tileData.type === TileType.JAIL) {

            console.log(
                `[JailSystem] ${player.node.name} landed on JAIL: ${tileData.name}.`
            );

            const playerJailData =
                player.getComponent(PlayerJailData);

            if (!playerJailData) {

                console.error(
                    `[JailSystem] ${player.node.name} has no PlayerJailData component.`
                );

                return false;
            }

            playerJailData.isInJail = true;
            playerJailData.jailTurns = 0;

            console.log(
                `[JailSystem] ${player.node.name} entered JAIL.`
            );

            console.log(
                `[JailSystem] State updated: isInJail=${playerJailData.isInJail}, jailTurns=${playerJailData.jailTurns}.`
            );

            return false;
        }

        // -------------------------------------------------
        // SPECIAL Step 2B — Airport / Transport Data Foundation
        // Read and verify Transport configuration only.
        // No money deduction, destination choice, movement, or UI yet.
        // Returning false keeps the existing normal turn flow.
        // -------------------------------------------------

        if (tileData.type === TileType.SPECIAL) {

            console.log(
                `[SpecialSystem] ${player.node.name} landed on SPECIAL: ${tileData.name}.`
            );

            if (tileData.specialType === undefined) {

                console.error(
                    `[SpecialSystem] ${tileData.name} does not have a specialType.`
                );

                return false;
            }

            console.log(
                `[SpecialSystem] Type = ${tileData.specialType}.`
            );

            if (tileData.specialType === SpecialType.TRANSPORT) {

                if (tileData.travelCost === undefined) {

                    console.error(
                        `[SpecialSystem] ${tileData.name} does not have a travelCost.`
                    );

                    return false;
                }

                if (
                    tileData.destinationTileIndices === undefined ||
                    tileData.destinationTileIndices.length === 0
                ) {

                    console.error(
                        `[SpecialSystem] ${tileData.name} does not have any destinationTileIndices.`
                    );

                    return false;
                }

                const destinationDescriptions =
                    tileData.destinationTileIndices.map(
                        (destinationTileIndex) => {

                            const destinationTile =
                                TILE_DATABASE[destinationTileIndex];

                            if (!destinationTile) {
                                return `Unknown Tile (${destinationTileIndex})`;
                            }

                            return `${destinationTile.name} (Tile_${destinationTileIndex.toString().padStart(2, '0')})`;
                        }
                    );

                console.log(
                    `[SpecialSystem] Travel cost = ${tileData.travelCost}.`
                );

                console.log(
                    `[SpecialSystem] Available destinations = ${destinationDescriptions.join(', ')}.`
                );

                this.pendingTransportDecision =
                    tileData;

                console.log(
                    `[SpecialSystem] Airport decision required for ${player.node.name}.`
                );

                console.log(
                    `[SpecialSystem] Pending Transport decision stored: ${tileData.name}.`
                );

                return false;
            }

            console.log(
                `[SpecialSystem] Special type ${tileData.specialType} is not implemented yet.`
            );

            return false;
        }

        // -------------------------------------------------
        // FREE_PARKING Step 1
        // Recognition only.
        // No money effect, no reward, no UI, no pending action.
        // Returning false keeps the existing normal turn flow.
        // -------------------------------------------------
        if (tileData.type === TileType.FREE_PARKING) {

            console.log(
                `[FreeParkingSystem] ${player.node.name} landed on FREE_PARKING: ${tileData.name}.`
            );

            console.log(
                '[FreeParkingSystem] No effect in Step 1. Turn will continue normally.'
            );

            return false;
        }

        // -------------------------------------------------
        // Existing PROPERTY / Rent logic
        // -------------------------------------------------

        if (tileData.type !== TileType.PROPERTY) {
            return false;
        }

        console.log(
            `[TileSystem] Property info: ${tileData.name}, price=${tileData.price}, ownerId=${tileData.ownerId}`
        );

        const playerEconomyData =
            player.getComponent(PlayerEconomyData);

        if (!playerEconomyData) {

            console.error(
                `[TileSystem] ${player.node.name} has no PlayerEconomyData component.`
            );

            return false;
        }

        if (tileData.ownerId !== null) {

            console.log(
                `[TileSystem] ${tileData.name} is owned by playerId=${tileData.ownerId}.`
            );

            if (
                tileData.ownerId ===
                playerEconomyData.playerId
            ) {

                console.log(
                    `[RentSystem] ${player.node.name} landed on their own property ${tileData.name}. No rent required.`
                );

                return false;
            }

            console.log(
                `[RentSystem] ${player.node.name} landed on ${tileData.name}, which belongs to playerId=${tileData.ownerId}.`
            );

            if (tileData.baseRent === undefined) {

                console.error(
                    `[RentSystem] ${tileData.name} does not have a valid baseRent.`
                );

                return false;
            }

            if (!this.economySystem) {

                console.error(
                    '[RentSystem] EconomySystem is not assigned.'
                );

                return false;
            }

            const payer =
                this.economySystem.getPlayerById(
                    playerEconomyData.playerId
                );

            if (!payer) {

                console.error(
                    `[RentSystem] Could not find payer playerId=${playerEconomyData.playerId}.`
                );

                return false;
            }

            const owner =
                this.economySystem.getPlayerById(
                    tileData.ownerId
                );

            if (!owner) {

                console.error(
                    `[RentSystem] Could not find property owner playerId=${tileData.ownerId}.`
                );

                return false;
            }

            const rent =
                tileData.baseRent;

            const payerMoneyBefore =
                payer.money;

            const ownerMoneyBefore =
                owner.money;

            this.economySystem.removeMoney(
                payer.playerId,
                rent
            );

            this.economySystem.addMoney(
                owner.playerId,
                rent
            );

            console.log(
                `[RentSystem] RENT PAID: ${player.node.name} paid ${rent} rent for ${tileData.name} to playerId=${owner.playerId}.`
            );

            console.log(
                `[RentSystem] Payer money: ${payerMoneyBefore} -> ${payer.money}`
            );

            console.log(
                `[RentSystem] Owner money: ${ownerMoneyBefore} -> ${owner.money}`
            );

            return false;
        }

        console.log(
            `[TileSystem] ${tileData.name} is available for purchase.`
        );

        if (tileData.price === undefined) {

            console.error(
                `[TileSystem] ${tileData.name} does not have a valid price.`
            );

            return false;
        }

        if (!this.economySystem) {

            console.error(
                '[TileSystem] EconomySystem is not assigned.'
            );

            return false;
        }

        const registeredPlayer =
            this.economySystem.getPlayerById(
                playerEconomyData.playerId
            );

        if (!registeredPlayer) {
            return false;
        }

        console.log(
            `[TileSystem] Economy lookup: ${player.node.name} -> playerId=${registeredPlayer.playerId}, money=${registeredPlayer.money}`
        );

        console.log(
            `[TileSystem] Affordability check: ${player.node.name} money=${registeredPlayer.money}, ${tileData.name} price=${tileData.price}`
        );

        if (
            registeredPlayer.money >=
            tileData.price
        ) {

            console.log(
                `[TileSystem] ${player.node.name} can afford ${tileData.name}.`
            );

            this.pendingProperty =
                tileData;

            console.log(
                `[TileSystem] Property purchase decision required for ${player.node.name} on ${tileData.name}.`
            );

            console.log(
                `[TileSystem] Pending property stored: ${tileData.name}, price=${tileData.price}.`
            );

            return true;
        }

        console.log(
            `[TileSystem] ${player.node.name} cannot afford ${tileData.name}.`
        );

        return false;
    }

    public getPendingChanceMoveSteps(): number | null {

        return this.pendingChanceMoveSteps;
    }

    public clearPendingChanceMove(): void {

        this.pendingChanceMoveSteps = null;

        console.log(
            '[ChanceSystem] Pending Chance MOVE cleared.'
        );
    }

    public getPendingDestinyMoveSteps(): number | null {

        return this.pendingDestinyMoveSteps;
    }

    public clearPendingDestinyMove(): void {

        this.pendingDestinyMoveSteps = null;

        console.log(
            '[DestinySystem] Pending Destiny MOVE cleared.'
        );
    }

    public getPendingGoToJailTargetTileIndex(): number | null {

        return this.pendingGoToJailTargetTileIndex;
    }

    public clearPendingGoToJailMove(): void {

        this.pendingGoToJailTargetTileIndex = null;

        console.log(
            '[GoToJailSystem] Pending forced move cleared.'
        );
    }

    public getPendingTransportDecision(): TileData | null {

        return this.pendingTransportDecision;
    }

    public clearPendingTransportDecision(): void {

        this.pendingTransportDecision = null;

        console.log(
            '[SpecialSystem] Pending Transport decision cleared.'
        );
    }

    public payPendingTransportCost(
        player: PlayerController
    ): boolean {

        const transportTile =
            this.pendingTransportDecision;

        if (!transportTile) {

            console.error(
                '[SpecialSystem] Cannot pay Transport cost because no pending Transport decision exists.'
            );

            return false;
        }

        if (
            transportTile.type !==
            TileType.SPECIAL
        ) {

            console.error(
                `[SpecialSystem] ${transportTile.name} is not a SPECIAL tile.`
            );

            return false;
        }

        if (
            transportTile.specialType !==
            SpecialType.TRANSPORT
        ) {

            console.error(
                `[SpecialSystem] ${transportTile.name} is not a TRANSPORT special.`
            );

            return false;
        }

        if (
            transportTile.travelCost ===
            undefined
        ) {

            console.error(
                `[SpecialSystem] ${transportTile.name} does not have a travelCost.`
            );

            return false;
        }

        const playerEconomyData =
            player.getComponent(
                PlayerEconomyData
            );

        if (!playerEconomyData) {

            console.error(
                `[SpecialSystem] ${player.node.name} has no PlayerEconomyData component.`
            );

            return false;
        }

        if (!this.economySystem) {

            console.error(
                '[SpecialSystem] EconomySystem is not assigned.'
            );

            return false;
        }

        const registeredPlayer =
            this.economySystem.getPlayerById(
                playerEconomyData.playerId
            );

        if (!registeredPlayer) {

            console.error(
                `[SpecialSystem] Could not find playerId=${playerEconomyData.playerId}.`
            );

            return false;
        }

        const travelCost =
            transportTile.travelCost;

        const moneyBefore =
            registeredPlayer.money;

        this.economySystem.removeMoney(
            registeredPlayer.playerId,
            travelCost
        );

        console.log(
            `[SpecialSystem] TRANSPORT FEE PAID: ${player.node.name} paid ${travelCost}.`
        );

        console.log(
            `[SpecialSystem] Money: ${moneyBefore} -> ${registeredPlayer.money}`
        );

        return true;
    }

    public getPendingProperty(): TileData | null {

        return this.pendingProperty;
    }

    public clearPendingProperty(): void {

        this.pendingProperty = null;

        console.log(
            '[TileSystem] Pending property cleared.'
        );
    }

    public purchasePendingProperty(
        player: PlayerController
    ): boolean {

        const tileData =
            this.pendingProperty;

        if (!tileData) {

            console.error(
                '[TileSystem] Cannot purchase because no pending property exists.'
            );

            return false;
        }

        if (tileData.type !== TileType.PROPERTY) {

            console.error(
                `[TileSystem] Cannot purchase ${tileData.name} because it is not a PROPERTY tile.`
            );

            return false;
        }

        if (tileData.ownerId !== null) {

            console.error(
                `[TileSystem] Cannot purchase ${tileData.name} because it is already owned by playerId=${tileData.ownerId}.`
            );

            return false;
        }

        if (tileData.price === undefined) {

            console.error(
                `[TileSystem] Cannot purchase ${tileData.name} because it has no valid price.`
            );

            return false;
        }

        const playerEconomyData =
            player.getComponent(PlayerEconomyData);

        if (!playerEconomyData) {

            console.error(
                `[TileSystem] ${player.node.name} has no PlayerEconomyData component.`
            );

            return false;
        }

        if (!this.economySystem) {

            console.error(
                '[TileSystem] EconomySystem is not assigned.'
            );

            return false;
        }

        const registeredPlayer =
            this.economySystem.getPlayerById(
                playerEconomyData.playerId
            );

        if (!registeredPlayer) {
            return false;
        }

        if (
            registeredPlayer.money <
            tileData.price
        ) {

            console.error(
                `[TileSystem] ${player.node.name} no longer has enough money to purchase ${tileData.name}.`
            );

            return false;
        }

        const propertyName =
            tileData.name;

        const purchasePrice =
            tileData.price;

        const buyerPlayerId =
            registeredPlayer.playerId;

        this.economySystem.removeMoney(
            buyerPlayerId,
            purchasePrice
        );

        tileData.ownerId =
            buyerPlayerId;

        console.log(
            `[TileSystem] PURCHASED: ${player.node.name} bought ${propertyName} for ${purchasePrice}.`
        );

        console.log(
            `[TileSystem] Purchase result: ${propertyName} ownerId=${tileData.ownerId}, ${player.node.name} money=${registeredPlayer.money}.`
        );

        this.clearPendingProperty();

        return true;
    }
}
