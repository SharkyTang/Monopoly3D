import { _decorator, Component, Vec3, tween } from 'cc';

import { BoardManager } from '../board/BoardManager';
import { PlayerEconomyData } from './PlayerEconomyData';
import { EconomySystem } from '../economy/EconomySystem';

const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(BoardManager)
    boardManager: BoardManager | null = null;

    @property(EconomySystem)
    economySystem: EconomySystem | null = null;

    @property
    currentTileIndex: number = 0;

    private isMoving: boolean = false;

    private static readonly START_REWARD: number = 2000;

    start() {
        console.log(
            `[PlayerController] ${this.node.name} starts at tile ${this.currentTileIndex}`
        );
    }

    public moveBySteps(
        steps: number,
        onComplete?: () => void
    ) {

        if (!this.boardManager) {
            console.error(
                '[PlayerController] BoardManager is not assigned.'
            );
            return;
        }

        if (this.isMoving) {
            console.warn(
                `[PlayerController] ${this.node.name} is already moving.`
            );
            return;
        }

        const tileCount = this.boardManager.tiles.length;

        if (tileCount === 0) {
            console.error(
                '[PlayerController] Board has no tiles.'
            );
            return;
        }

        if (steps === 0) {
            console.warn(
                `[PlayerController] Invalid step count: ${steps}`
            );
            return;
        }

        this.isMoving = true;

        const direction =
            steps > 0 ? 1 : -1;

        const totalSteps =
            Math.abs(steps);

        let nextIndex = this.currentTileIndex;
        let movementTween = tween(this.node);

        for (
            let step = 0;
            step < totalSteps;
            step++
        ) {

            nextIndex =
                (
                    nextIndex +
                    direction +
                    tileCount
                ) % tileCount;

            const stepIndex = nextIndex;

            const isFinalStep =
                step === totalSteps - 1;

            const tile =
                this.boardManager.getTile(
                    stepIndex
                );

            if (!tile) {

                console.error(
                    `[PlayerController] Tile ${stepIndex} does not exist.`
                );

                this.isMoving = false;
                return;
            }

            const worldTarget =
                new Vec3();

            tile.getWorldPosition(
                worldTarget
            );

            // 让棋子站在棋盘格上方
            worldTarget.y += 0.6;

            const localTarget =
                new Vec3();

            if (this.node.parent) {

                this.node.parent.inverseTransformPoint(
                    localTarget,
                    worldTarget
                );

            } else {

                localTarget.set(
                    worldTarget
                );
            }

            movementTween =
                movementTween
                    .to(
                        0.25,
                        {
                            position:
                                localTarget
                        },
                        {
                            easing:
                                'quadInOut'
                        }
                    )
                    .call(() => {

                        this.currentTileIndex =
                            stepIndex;

                        console.log(
                            `[PlayerController] ${this.node.name} reached Tile_${stepIndex
                                .toString()
                                .padStart(2, '0')}`
                        );

                        // START detection.
                        //
                        // Forward movement keeps the existing rule:
                        // passing START or landing on START gives +2000.
                        //
                        // Backward movement only gives the reward when
                        // the final destination is START. This supports
                        // Chance Move Backward -2 from Tile_02 to Tile_00
                        // without changing the existing forward rule.
                        if (stepIndex === 0) {

                            if (direction > 0) {

                                if (isFinalStep) {

                                    console.log(
                                        `[StartSystem] ${this.node.name} LANDED ON START.`
                                    );

                                } else {

                                    console.log(
                                        `[StartSystem] ${this.node.name} PASSED START.`
                                    );
                                }

                                this.giveStartReward();

                            } else if (isFinalStep) {

                                console.log(
                                    `[StartSystem] ${this.node.name} LANDED ON START.`
                                );

                                this.giveStartReward();
                            }
                        }
                    });
        }

        movementTween
            .call(() => {

                this.isMoving = false;

                console.log(
                    `[PlayerController] ${this.node.name} movement finished at tile ${this.currentTileIndex}`
                );

                if (onComplete) {
                    onComplete();
                }
            })
            .start();
    }

    public moveToTileForTransport(
        targetTileIndex: number,
        onComplete?: () => void
    ): boolean {

        if (!this.boardManager) {

            console.error(
                '[TransportSystem] BoardManager is not assigned.'
            );

            return false;
        }

        if (this.isMoving) {

            console.warn(
                `[TransportSystem] ${this.node.name} is already moving.`
            );

            return false;
        }

        const tileCount =
            this.boardManager.tiles.length;

        if (tileCount === 0) {

            console.error(
                '[TransportSystem] Board has no tiles.'
            );

            return false;
        }

        if (
            targetTileIndex < 0 ||
            targetTileIndex >= tileCount
        ) {

            console.error(
                `[TransportSystem] Invalid destination tile index: ${targetTileIndex}.`
            );

            return false;
        }

        if (
            targetTileIndex ===
            this.currentTileIndex
        ) {

            console.error(
                `[TransportSystem] ${this.node.name} cannot travel to their current tile ${targetTileIndex}.`
            );

            return false;
        }

        const tile =
            this.boardManager.getTile(
                targetTileIndex
            );

        if (!tile) {

            console.error(
                `[TransportSystem] Destination Tile_${targetTileIndex
                    .toString()
                    .padStart(2, '0')} does not exist.`
            );

            return false;
        }

        const worldTarget =
            new Vec3();

        tile.getWorldPosition(
            worldTarget
        );

        worldTarget.y += 0.6;

        const localTarget =
            new Vec3();

        if (this.node.parent) {

            this.node.parent.inverseTransformPoint(
                localTarget,
                worldTarget
            );

        } else {

            localTarget.set(
                worldTarget
            );
        }

        const startTileIndex =
            this.currentTileIndex;

        this.isMoving =
            true;

        console.log(
            `[TransportSystem] ${this.node.name} transport started: Tile_${startTileIndex
                .toString()
                .padStart(2, '0')} -> Tile_${targetTileIndex
                .toString()
                .padStart(2, '0')}.`
        );

        console.log(
            '[TransportSystem] Airport travel does not trigger START pass / landing reward.'
        );

        tween(this.node)
            .to(
                0.75,
                {
                    position:
                        localTarget
                },
                {
                    easing:
                        'quadInOut'
                }
            )
            .call(() => {

                this.currentTileIndex =
                    targetTileIndex;

                this.isMoving =
                    false;

                console.log(
                    `[TransportSystem] ${this.node.name} arrived at Tile_${targetTileIndex
                        .toString()
                        .padStart(2, '0')}.`
                );

                if (onComplete) {
                    onComplete();
                }
            })
            .start();

        return true;
    }

    public moveToTileForForcedMove(
        targetTileIndex: number,
        onComplete?: () => void
    ): boolean {

        if (!this.boardManager) {

            console.error(
                '[ForcedMoveSystem] BoardManager is not assigned.'
            );

            return false;
        }

        if (this.isMoving) {

            console.warn(
                `[ForcedMoveSystem] ${this.node.name} is already moving.`
            );

            return false;
        }

        const tileCount =
            this.boardManager.tiles.length;

        if (tileCount === 0) {

            console.error(
                '[ForcedMoveSystem] Board has no tiles.'
            );

            return false;
        }

        if (
            targetTileIndex < 0 ||
            targetTileIndex >= tileCount
        ) {

            console.error(
                `[ForcedMoveSystem] Invalid target tile index: ${targetTileIndex}.`
            );

            return false;
        }

        if (
            targetTileIndex ===
            this.currentTileIndex
        ) {

            console.error(
                `[ForcedMoveSystem] ${this.node.name} is already on tile ${targetTileIndex}.`
            );

            return false;
        }

        const tile =
            this.boardManager.getTile(
                targetTileIndex
            );

        if (!tile) {

            console.error(
                `[ForcedMoveSystem] Target Tile_${targetTileIndex
                    .toString()
                    .padStart(2, '0')} does not exist.`
            );

            return false;
        }

        const worldTarget =
            new Vec3();

        tile.getWorldPosition(
            worldTarget
        );

        worldTarget.y += 0.6;

        const localTarget =
            new Vec3();

        if (this.node.parent) {

            this.node.parent.inverseTransformPoint(
                localTarget,
                worldTarget
            );

        } else {

            localTarget.set(
                worldTarget
            );
        }

        const startTileIndex =
            this.currentTileIndex;

        this.isMoving =
            true;

        console.log(
            `[ForcedMoveSystem] ${this.node.name} forced move started: Tile_${startTileIndex
                .toString()
                .padStart(2, '0')} -> Tile_${targetTileIndex
                .toString()
                .padStart(2, '0')}.`
        );

        console.log(
            '[ForcedMoveSystem] Forced movement does not trigger START pass / landing reward.'
        );

        tween(this.node)
            .to(
                0.75,
                {
                    position:
                        localTarget
                },
                {
                    easing:
                        'quadInOut'
                }
            )
            .call(() => {

                this.currentTileIndex =
                    targetTileIndex;

                this.isMoving =
                    false;

                console.log(
                    `[ForcedMoveSystem] ${this.node.name} arrived at Tile_${targetTileIndex
                        .toString()
                        .padStart(2, '0')}.`
                );

                if (onComplete) {
                    onComplete();
                }
            })
            .start();

        return true;
    }

    private giveStartReward(): void {

        const playerEconomyData =
            this.getComponent(
                PlayerEconomyData
            );

        if (!playerEconomyData) {

            console.error(
                `[StartSystem] ${this.node.name} has no PlayerEconomyData component.`
            );

            return;
        }

        if (!this.economySystem) {

            console.error(
                `[StartSystem] EconomySystem is not assigned for ${this.node.name}.`
            );

            return;
        }

        const registeredPlayer =
            this.economySystem.getPlayerById(
                playerEconomyData.playerId
            );

        if (!registeredPlayer) {

            console.error(
                `[StartSystem] Could not find playerId=${playerEconomyData.playerId}.`
            );

            return;
        }

        const moneyBefore =
            registeredPlayer.money;

        this.economySystem.addMoney(
            registeredPlayer.playerId,
            PlayerController.START_REWARD
        );

        console.log(
            `[StartSystem] START REWARD: ${this.node.name} received ${PlayerController.START_REWARD}.`
        );

        console.log(
            `[StartSystem] Money: ${moneyBefore} -> ${registeredPlayer.money}`
        );
    }
}