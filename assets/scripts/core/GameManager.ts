import {
    _decorator,
    Component,
    Button,
    Label,
    Node
} from 'cc';

import {
    DiceSystem
} from '../dice/DiceSystem';

import {
    TurnManager
} from './TurnManager';

import {
    TileSystem
} from '../tile/TileSystem';

import {
    PropertyPurchaseUI
} from '../ui/PropertyPurchaseUI';

import {
    PlayerController
} from '../player/PlayerController';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(DiceSystem)
    diceSystem: DiceSystem | null = null;

    @property(TurnManager)
    turnManager: TurnManager | null = null;

    @property(TileSystem)
    tileSystem: TileSystem | null = null;

    @property(PropertyPurchaseUI)
    propertyPurchaseUI: PropertyPurchaseUI | null = null;

    @property(Button)
    rollDiceButton: Button | null = null;

    @property(Label)
    diceResultLabel: Label | null = null;

    @property(Label)
    turnLabel: Label | null = null;

    @property(Node)
    airportPanel: Node | null = null;

    start(): void {

        console.log(
            '[GameManager] Monopoly3D started!'
        );

        if (this.diceResultLabel) {
            this.diceResultLabel.string =
                'READY';
        }

        if (this.airportPanel) {
            this.airportPanel.active =
                false;
        }

        this.updateTurnUI();
    }

    public rollDiceAndMove(): void {

        if (!this.diceSystem) {

            console.error(
                '[GameManager] DiceSystem is not assigned.'
            );

            return;
        }

        if (!this.turnManager) {

            console.error(
                '[GameManager] TurnManager is not assigned.'
            );

            return;
        }

        const currentPlayer =
            this.turnManager.getCurrentPlayer();

        if (!currentPlayer) {

            console.error(
                '[GameManager] Current player does not exist.'
            );

            return;
        }

        if (this.rollDiceButton) {

            this.rollDiceButton.interactable =
                false;
        }

        const result =
            this.diceSystem.roll();

        if (this.diceResultLabel) {

            this.diceResultLabel.string =
                `${result.die1} + ${result.die2} = ${result.total}`;
        }

        console.log(
            `[GameManager] ${currentPlayer.node.name} rolled ${result.total}`
        );

        currentPlayer.moveBySteps(
            result.total,
            () => {

                console.log(
                    `[GameManager] ${currentPlayer.node.name} movement completed.`
                );

                let needsPropertyDecision =
                    false;

                if (this.tileSystem) {

                    needsPropertyDecision =
                        this.tileSystem.resolveLanding(
                            currentPlayer
                        );

                } else {

                    console.error(
                        '[GameManager] TileSystem is not assigned.'
                    );
                }

                if (needsPropertyDecision) {

                    console.log(
                        `[GameManager] Turn paused. Waiting for property purchase decision from ${currentPlayer.node.name}.`
                    );

                    const pendingProperty =
                        this.tileSystem
                            ?.getPendingProperty();

                    if (!pendingProperty) {

                        console.error(
                            '[GameManager] Property decision required, but no pending property was found.'
                        );

                        return;
                    }

                    if (
                        pendingProperty.price ===
                        undefined
                    ) {

                        console.error(
                            `[GameManager] Pending property ${pendingProperty.name} has no valid price.`
                        );

                        return;
                    }

                    if (!this.propertyPurchaseUI) {

                        console.error(
                            '[GameManager] PropertyPurchaseUI is not assigned.'
                        );

                        return;
                    }

                    this.propertyPurchaseUI.show(
                        pendingProperty.name,
                        pendingProperty.price
                    );

                    console.log(
                        `[GameManager] Property purchase UI opened for ${pendingProperty.name}.`
                    );

                    return;
                }

                if (
                    this.tryHandlePendingGoToJailMove(
                        currentPlayer,
                        'normal landing'
                    )
                ) {
                    return;
                }

                const pendingChanceMoveSteps =
                    this.tileSystem
                        ?.getPendingChanceMoveSteps();

                if (
                    pendingChanceMoveSteps !== null &&
                    pendingChanceMoveSteps !== undefined
                ) {

                    this.tileSystem
                        ?.clearPendingChanceMove();

                    console.log(
                        `[GameManager] Chance MOVE started: ${currentPlayer.node.name} will move ${pendingChanceMoveSteps} extra tiles.`
                    );

                    currentPlayer.moveBySteps(
                        pendingChanceMoveSteps,
                        () => {

                            console.log(
                                `[GameManager] Chance MOVE completed: ${currentPlayer.node.name} is now at tile ${currentPlayer.currentTileIndex}.`
                            );

                            console.log(
                                `[GameManager] Resolving landing after Chance MOVE for ${currentPlayer.node.name}.`
                            );

                            let needsPropertyDecisionAfterChanceMove =
                                false;

                            if (this.tileSystem) {

                                needsPropertyDecisionAfterChanceMove =
                                    this.tileSystem.resolveLanding(
                                        currentPlayer
                                    );

                            } else {

                                console.error(
                                    '[GameManager] TileSystem is not assigned while resolving Chance MOVE landing.'
                                );
                            }

                            if (needsPropertyDecisionAfterChanceMove) {

                                console.log(
                                    `[GameManager] Turn paused after Chance MOVE. Waiting for property purchase decision from ${currentPlayer.node.name}.`
                                );

                                const pendingProperty =
                                    this.tileSystem
                                        ?.getPendingProperty();

                                if (!pendingProperty) {

                                    console.error(
                                        '[GameManager] Property decision required after Chance MOVE, but no pending property was found.'
                                    );

                                    return;
                                }

                                if (
                                    pendingProperty.price ===
                                    undefined
                                ) {

                                    console.error(
                                        `[GameManager] Pending property ${pendingProperty.name} has no valid price after Chance MOVE.`
                                    );

                                    return;
                                }

                                if (!this.propertyPurchaseUI) {

                                    console.error(
                                        '[GameManager] PropertyPurchaseUI is not assigned after Chance MOVE.'
                                    );

                                    return;
                                }

                                this.propertyPurchaseUI.show(
                                    pendingProperty.name,
                                    pendingProperty.price
                                );

                                console.log(
                                    `[GameManager] Property purchase UI opened after Chance MOVE for ${pendingProperty.name}.`
                                );

                                return;
                            }

                            if (
                                this.tryHandlePendingGoToJailMove(
                                    currentPlayer,
                                    'Chance MOVE landing'
                                )
                            ) {
                                return;
                            }

                            const pendingTransportDecisionAfterChanceMove =
                                this.tileSystem
                                    ?.getPendingTransportDecision();

                            if (pendingTransportDecisionAfterChanceMove) {

                                console.log(
                                    `[GameManager] Airport decision detected after Chance MOVE for ${currentPlayer.node.name} at ${pendingTransportDecisionAfterChanceMove.name}.`
                                );

                                console.log(
                                    `[GameManager] Turn paused after Chance MOVE. Waiting for Airport / Transport decision from ${currentPlayer.node.name}.`
                                );

                                this.showAirportDecisionUI();

                                return;
                            }

                            this.turnManager.nextTurn();

                            this.updateTurnUI();

                            if (this.rollDiceButton) {

                                this.rollDiceButton.interactable =
                                    true;
                            }
                        }
                    );

                    return;
                }

                const pendingDestinyMoveSteps =
                    this.tileSystem
                        ?.getPendingDestinyMoveSteps();

                if (
                    pendingDestinyMoveSteps !== null &&
                    pendingDestinyMoveSteps !== undefined
                ) {

                    this.tileSystem
                        ?.clearPendingDestinyMove();

                    console.log(
                        `[GameManager] Destiny MOVE started: ${currentPlayer.node.name} will move ${pendingDestinyMoveSteps} extra tiles.`
                    );

                    currentPlayer.moveBySteps(
                        pendingDestinyMoveSteps,
                        () => {

                            console.log(
                                `[GameManager] Destiny MOVE completed: ${currentPlayer.node.name} is now at tile ${currentPlayer.currentTileIndex}.`
                            );

                            console.log(
                                `[GameManager] Resolving landing after Destiny MOVE for ${currentPlayer.node.name}.`
                            );

                            let needsPropertyDecisionAfterDestinyMove =
                                false;

                            if (this.tileSystem) {

                                needsPropertyDecisionAfterDestinyMove =
                                    this.tileSystem.resolveLanding(
                                        currentPlayer
                                    );

                            } else {

                                console.error(
                                    '[GameManager] TileSystem is not assigned while resolving Destiny MOVE landing.'
                                );
                            }

                            if (needsPropertyDecisionAfterDestinyMove) {

                                console.log(
                                    `[GameManager] Turn paused after Destiny MOVE. Waiting for property purchase decision from ${currentPlayer.node.name}.`
                                );

                                const pendingProperty =
                                    this.tileSystem
                                        ?.getPendingProperty();

                                if (!pendingProperty) {

                                    console.error(
                                        '[GameManager] Property decision required after Destiny MOVE, but no pending property was found.'
                                    );

                                    return;
                                }

                                if (
                                    pendingProperty.price ===
                                    undefined
                                ) {

                                    console.error(
                                        `[GameManager] Pending property ${pendingProperty.name} has no valid price after Destiny MOVE.`
                                    );

                                    return;
                                }

                                if (!this.propertyPurchaseUI) {

                                    console.error(
                                        '[GameManager] PropertyPurchaseUI is not assigned after Destiny MOVE.'
                                    );

                                    return;
                                }

                                this.propertyPurchaseUI.show(
                                    pendingProperty.name,
                                    pendingProperty.price
                                );

                                console.log(
                                    `[GameManager] Property purchase UI opened after Destiny MOVE for ${pendingProperty.name}.`
                                );

                                return;
                            }

                            if (
                                this.tryHandlePendingGoToJailMove(
                                    currentPlayer,
                                    'Destiny MOVE landing'
                                )
                            ) {
                                return;
                            }

                            const pendingTransportDecisionAfterDestinyMove =
                                this.tileSystem
                                    ?.getPendingTransportDecision();

                            if (pendingTransportDecisionAfterDestinyMove) {

                                console.log(
                                    `[GameManager] Airport decision detected after Destiny MOVE for ${currentPlayer.node.name} at ${pendingTransportDecisionAfterDestinyMove.name}.`
                                );

                                console.log(
                                    `[GameManager] Turn paused after Destiny MOVE. Waiting for Airport / Transport decision from ${currentPlayer.node.name}.`
                                );

                                this.showAirportDecisionUI();

                                return;
                            }

                            this.turnManager.nextTurn();

                            this.updateTurnUI();

                            if (this.rollDiceButton) {

                                this.rollDiceButton.interactable =
                                    true;
                            }
                        }
                    );

                    return;
                }

                const pendingTransportDecision =
                    this.tileSystem
                        ?.getPendingTransportDecision();

                if (pendingTransportDecision) {

                    console.log(
                        `[GameManager] Airport decision detected for ${currentPlayer.node.name} at ${pendingTransportDecision.name}.`
                    );

                    console.log(
                        `[GameManager] Turn paused. Waiting for Airport / Transport decision from ${currentPlayer.node.name}.`
                    );

                    this.showAirportDecisionUI();

                    return;
                }

                this.turnManager.nextTurn();

                this.updateTurnUI();

                if (this.rollDiceButton) {

                    this.rollDiceButton.interactable =
                        true;
                }
            }
        );
    }

    public onSkipPropertyPurchase(): void {

        if (!this.turnManager) {

            console.error(
                '[GameManager] Cannot skip purchase because TurnManager is not assigned.'
            );

            return;
        }

        const currentPlayer =
            this.turnManager.getCurrentPlayer();

        if (!currentPlayer) {

            console.error(
                '[GameManager] Cannot skip purchase because current player does not exist.'
            );

            return;
        }

        const pendingProperty =
            this.tileSystem
                ?.getPendingProperty();

        if (!pendingProperty) {

            console.error(
                '[GameManager] Cannot skip purchase because no pending property exists.'
            );

            return;
        }

        console.log(
            `[GameManager] ${currentPlayer.node.name} skipped purchasing ${pendingProperty.name}.`
        );

        if (this.propertyPurchaseUI) {

            this.propertyPurchaseUI.hide();
        }

        this.tileSystem
            ?.clearPendingProperty();

        this.turnManager.nextTurn();

        this.updateTurnUI();

        if (this.rollDiceButton) {

            this.rollDiceButton.interactable =
                true;
        }

        console.log(
            '[GameManager] Property purchase skip completed. Turn resumed.'
        );
    }

    public onBuyProperty(): void {

        if (!this.turnManager) {

            console.error(
                '[GameManager] Cannot buy property because TurnManager is not assigned.'
            );

            return;
        }

        if (!this.tileSystem) {

            console.error(
                '[GameManager] Cannot buy property because TileSystem is not assigned.'
            );

            return;
        }

        const currentPlayer =
            this.turnManager.getCurrentPlayer();

        if (!currentPlayer) {

            console.error(
                '[GameManager] Cannot buy property because current player does not exist.'
            );

            return;
        }

        const purchaseSucceeded =
            this.tileSystem.purchasePendingProperty(
                currentPlayer
            );

        if (!purchaseSucceeded) {

            console.error(
                `[GameManager] Property purchase failed for ${currentPlayer.node.name}.`
            );

            return;
        }

        if (this.propertyPurchaseUI) {

            this.propertyPurchaseUI.hide();
        }

        this.turnManager.nextTurn();

        this.updateTurnUI();

        if (this.rollDiceButton) {

            this.rollDiceButton.interactable =
                true;
        }

        console.log(
            `[GameManager] Property purchase completed for ${currentPlayer.node.name}. Turn resumed.`
        );
    }

    public onTravelToAirportDestination(): void {

        if (!this.turnManager) {

            console.error(
                '[GameManager] Cannot travel from Airport because TurnManager is not assigned.'
            );

            return;
        }

        if (!this.tileSystem) {

            console.error(
                '[GameManager] Cannot travel from Airport because TileSystem is not assigned.'
            );

            return;
        }

        const currentPlayer =
            this.turnManager.getCurrentPlayer();

        if (!currentPlayer) {

            console.error(
                '[GameManager] Cannot travel from Airport because current player does not exist.'
            );

            return;
        }

        const pendingTransportDecision =
            this.tileSystem
                .getPendingTransportDecision();

        if (!pendingTransportDecision) {

            console.error(
                '[GameManager] Cannot travel from Airport because no pending Transport decision exists.'
            );

            return;
        }

        if (
            !pendingTransportDecision
                .destinationTileIndices ||
            pendingTransportDecision
                .destinationTileIndices
                .length === 0
        ) {

            console.error(
                `[GameManager] ${pendingTransportDecision.name} has no valid Transport destination.`
            );

            return;
        }

        const destinationTileIndex =
            pendingTransportDecision
                .destinationTileIndices[0];

        if (
            destinationTileIndex ===
            currentPlayer.currentTileIndex
        ) {

            console.error(
                `[GameManager] ${currentPlayer.node.name} cannot choose the current tile as an Airport destination.`
            );

            return;
        }

        if (
            !currentPlayer.boardManager ||
            destinationTileIndex < 0 ||
            destinationTileIndex >=
                currentPlayer
                    .boardManager
                    .tiles
                    .length
        ) {

            console.error(
                `[GameManager] Airport destination tile index ${destinationTileIndex} is invalid.`
            );

            return;
        }

        const paymentSucceeded =
            this.tileSystem
                .payPendingTransportCost(
                    currentPlayer
                );

        if (!paymentSucceeded) {

            console.log(
                `[GameManager] Airport travel not started for ${currentPlayer.node.name}. Stay Here remains available.`
            );

            return;
        }

        console.log(
            `[GameManager] ${currentPlayer.node.name} chose Airport travel to Tile_${destinationTileIndex
                .toString()
                .padStart(2, '0')}.`
        );

        this.tileSystem
            .clearPendingTransportDecision();

        if (this.airportPanel) {
            this.airportPanel.active =
                false;
        }

        const movementStarted =
            currentPlayer
                .moveToTileForTransport(
                    destinationTileIndex,
                    () => {

                        console.log(
                            `[GameManager] Airport Transport completed for ${currentPlayer.node.name}.`
                        );

                        if (this.rollDiceButton) {
                            this.rollDiceButton.node.active =
                                true;
                        }

                        if (this.diceResultLabel) {
                            this.diceResultLabel.node.active =
                                true;
                        }

                        if (this.turnLabel) {
                            this.turnLabel.node.active =
                                true;
                        }

                        console.log(
                            `[GameManager] Resolving landing after Airport Transport for ${currentPlayer.node.name}.`
                        );

                        const needsPropertyDecision =
                            this.tileSystem
                                ?.resolveLanding(
                                    currentPlayer
                                ) ?? false;

                        if (needsPropertyDecision) {

                            console.log(
                                `[GameManager] Turn paused after Airport Transport. Waiting for property purchase decision from ${currentPlayer.node.name}.`
                            );

                            const pendingProperty =
                                this.tileSystem
                                    ?.getPendingProperty();

                            if (!pendingProperty) {

                                console.error(
                                    '[GameManager] Property decision required after Airport Transport, but no pending property was found.'
                                );

                                return;
                            }

                            if (
                                pendingProperty.price ===
                                undefined
                            ) {

                                console.error(
                                    `[GameManager] Pending property ${pendingProperty.name} has no valid price after Airport Transport.`
                                );

                                return;
                            }

                            if (!this.propertyPurchaseUI) {

                                console.error(
                                    '[GameManager] PropertyPurchaseUI is not assigned after Airport Transport.'
                                );

                                return;
                            }

                            this.propertyPurchaseUI.show(
                                pendingProperty.name,
                                pendingProperty.price
                            );

                            console.log(
                                `[GameManager] Property purchase UI opened after Airport Transport for ${pendingProperty.name}.`
                            );

                            return;
                        }

                        if (
                            this.tryHandlePendingGoToJailMove(
                                currentPlayer,
                                'Airport Transport landing'
                            )
                        ) {
                            return;
                        }

                        this.turnManager
                            ?.nextTurn();

                        this.updateTurnUI();

                        if (this.rollDiceButton) {
                            this.rollDiceButton.interactable =
                                true;
                        }

                        console.log(
                            '[GameManager] Airport Travel completed. Turn resumed.'
                        );
                    }
                );

        if (!movementStarted) {

            console.error(
                `[GameManager] Airport Transport movement failed to start for ${currentPlayer.node.name}.`
            );

            // The configuration is validated before payment, and under the
            // current stable turn flow the player cannot still be moving here.
            // This branch is therefore only a defensive error guard.
        }
    }

    public onStayHereAtAirport(): void {

        if (!this.turnManager) {

            console.error(
                '[GameManager] Cannot stay at Airport because TurnManager is not assigned.'
            );

            return;
        }

        const currentPlayer =
            this.turnManager.getCurrentPlayer();

        if (!currentPlayer) {

            console.error(
                '[GameManager] Cannot stay at Airport because current player does not exist.'
            );

            return;
        }

        const pendingTransportDecision =
            this.tileSystem
                ?.getPendingTransportDecision();

        if (!pendingTransportDecision) {

            console.error(
                '[GameManager] Cannot stay at Airport because no pending Transport decision exists.'
            );

            return;
        }

        console.log(
            `[GameManager] ${currentPlayer.node.name} chose Stay Here at ${pendingTransportDecision.name}.`
        );

        this.tileSystem
            ?.clearPendingTransportDecision();

        if (this.airportPanel) {
            this.airportPanel.active =
                false;
        }

        if (this.rollDiceButton) {
            this.rollDiceButton.node.active =
                true;
        }

        if (this.diceResultLabel) {
            this.diceResultLabel.node.active =
                true;
        }

        if (this.turnLabel) {
            this.turnLabel.node.active =
                true;
        }

        this.turnManager.nextTurn();

        this.updateTurnUI();

        if (this.rollDiceButton) {
            this.rollDiceButton.interactable =
                true;
        }

        console.log(
            '[GameManager] Airport Stay Here completed. Turn resumed.'
        );
    }

    private tryHandlePendingGoToJailMove(
        player: PlayerController,
        sourceContext: string
    ): boolean {

        if (!this.tileSystem) {
            return false;
        }

        const targetTileIndex =
            this.tileSystem
                .getPendingGoToJailTargetTileIndex();

        if (
            targetTileIndex === null ||
            targetTileIndex === undefined
        ) {
            return false;
        }

        console.log(
            `[GameManager] GO_TO_JAIL forced move detected after ${sourceContext} for ${player.node.name}.`
        );

        const movementStarted =
            player.moveToTileForForcedMove(
                targetTileIndex,
                () => {

                    console.log(
                        `[GameManager] GO_TO_JAIL forced move completed for ${player.node.name}.`
                    );

                    if (!this.tileSystem) {

                        console.error(
                            '[GameManager] TileSystem is not assigned while resolving JAIL after GO_TO_JAIL forced move.'
                        );

                        return;
                    }

                    console.log(
                        `[GameManager] Resolving JAIL landing after GO_TO_JAIL forced move for ${player.node.name}.`
                    );

                    const needsPropertyDecisionAfterGoToJailMove =
                        this.tileSystem.resolveLanding(
                            player
                        );

                    if (needsPropertyDecisionAfterGoToJailMove) {

                        console.error(
                            '[GameManager] Unexpected property purchase decision after GO_TO_JAIL forced move.'
                        );

                        return;
                    }

                    console.log(
                        `[GameManager] GO_TO_JAIL Jail-state integration completed for ${player.node.name}.`
                    );

                    this.turnManager
                        ?.nextTurn();

                    this.updateTurnUI();

                    if (this.rollDiceButton) {

                        this.rollDiceButton.interactable =
                            true;
                    }
                }
            );

        if (!movementStarted) {

            console.error(
                `[GameManager] GO_TO_JAIL forced movement failed to start for ${player.node.name}.`
            );

            return true;
        }

        this.tileSystem
            .clearPendingGoToJailMove();

        return true;
    }

    private showAirportDecisionUI(): void {

        if (!this.airportPanel) {

            console.error(
                '[GameManager] AirportPanel is not assigned.'
            );

            return;
        }

        this.airportPanel.active =
            true;

        if (this.rollDiceButton) {
            this.rollDiceButton.node.active =
                false;
        }

        if (this.diceResultLabel) {
            this.diceResultLabel.node.active =
                false;
        }

        if (this.turnLabel) {
            this.turnLabel.node.active =
                false;
        }

        console.log(
            '[GameManager] AirportPanel opened.'
        );
    }

    private updateTurnUI(): void {

        if (!this.turnManager) {
            return;
        }

        const index =
            this.turnManager
                .getCurrentPlayerIndex();

        if (this.turnLabel) {

            this.turnLabel.string =
                `PLAYER ${index + 1} TURN`;
        }

        if (this.diceResultLabel) {

            this.diceResultLabel.string =
                'READY';
        }
    }
}