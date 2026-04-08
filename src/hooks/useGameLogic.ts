import { useState, useCallback } from 'react';
import { GameState, PlayerAction, RoundResult, Character, HitZone, HitResult } from '@/types/game';

const BLOCK_REDUCTION = 0.85;
const DOUBLE_STRIKE_UNLOCK_ROUND = 5;

function calcDamage(attacker: Character, zone: HitZone): number {
  return attacker.attackPower[zone];
}

function resolveHit(attacker: Character, zone: HitZone, defenderBlocks: HitZone[]): HitResult {
  const blocked = defenderBlocks.includes(zone);
  const raw = calcDamage(attacker, zone);
  return {
    zone,
    damage: blocked ? Math.round(raw * (1 - BLOCK_REDUCTION)) : raw,
    blocked,
  };
}

function aiSelectAction(char: Character, round: number, dsAvailable: boolean): PlayerAction {
  const zones: HitZone[] = ['head', 'body', 'legs'];

  if (dsAvailable && round >= DOUBLE_STRIKE_UNLOCK_ROUND && Math.random() < 0.4) {
    const z1 = zones[Math.floor(Math.random() * 3)];
    const z2 = zones[Math.floor(Math.random() * 3)];
    const blockZone = zones[Math.floor(Math.random() * 3)];
    return {
      attackZone: null,
      blockZones: [],
      useDoubleStrike: true,
      doubleStrikeZones: [z1, z2],
      doubleStrikeBlockZone: blockZone,
    };
  }

  const attackZone = Math.random() < 0.7 ? zones[Math.floor(Math.random() * 3)] : null;
  const blockCount = Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 2 : 0;
  const shuffled = [...zones].sort(() => Math.random() - 0.5);
  const blockZones = shuffled.slice(0, blockCount);

  return {
    attackZone,
    blockZones,
    useDoubleStrike: false,
    doubleStrikeZones: null,
    doubleStrikeBlockZone: null,
  };
}

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const startGame = useCallback((p1: Character, p2: Character, vsAI: boolean) => {
    setGameState({
      player1: p1,
      player2: p2,
      player1Hp: p1.maxHp,
      player2Hp: p2.maxHp,
      player1Action: null,
      player2Action: null,
      currentRound: 1,
      roundHistory: [],
      phase: 'select-action',
      winner: null,
      doubleStrikeAvailable: false,
      isVsAI: vsAI,
    });
  }, []);

  const resolveRound = useCallback((prev: GameState, p1Action: PlayerAction, p2Action: PlayerAction): GameState => {
    const p1Blocks = p1Action.useDoubleStrike
      ? (p1Action.doubleStrikeBlockZone ? [p1Action.doubleStrikeBlockZone] : [])
      : p1Action.blockZones;

    const p2Blocks = p2Action.useDoubleStrike
      ? (p2Action.doubleStrikeBlockZone ? [p2Action.doubleStrikeBlockZone] : [])
      : p2Action.blockZones;

    const p1Hits: HitResult[] = [];
    const p2Hits: HitResult[] = [];

    if (p1Action.useDoubleStrike && p1Action.doubleStrikeZones) {
      p1Action.doubleStrikeZones.forEach(z => p1Hits.push(resolveHit(prev.player1, z, p2Blocks)));
    } else if (p1Action.attackZone) {
      p1Hits.push(resolveHit(prev.player1, p1Action.attackZone, p2Blocks));
    }

    if (p2Action.useDoubleStrike && p2Action.doubleStrikeZones) {
      p2Action.doubleStrikeZones.forEach(z => p2Hits.push(resolveHit(prev.player2, z, p1Blocks)));
    } else if (p2Action.attackZone) {
      p2Hits.push(resolveHit(prev.player2, p2Action.attackZone, p1Blocks));
    }

    const p1TotalDmg = p2Hits.reduce((s, h) => s + h.damage, 0);
    const p2TotalDmg = p1Hits.reduce((s, h) => s + h.damage, 0);

    const newP1Hp = Math.max(0, prev.player1Hp - p1TotalDmg);
    const newP2Hp = Math.max(0, prev.player2Hp - p2TotalDmg);

    const result: RoundResult = {
      round: prev.currentRound,
      player1Action: p1Action,
      player2Action: p2Action,
      player1Hits: p2Hits,
      player2Hits: p1Hits,
      player1TotalDamage: p1TotalDmg,
      player2TotalDamage: p2TotalDmg,
      player1Hp: newP1Hp,
      player2Hp: newP2Hp,
      doubleStrikeUsedBy: p1Action.useDoubleStrike ? 'player1' : p2Action.useDoubleStrike ? 'player2' : null,
    };

    let winner: 'player1' | 'player2' | null = null;
    if (newP1Hp <= 0 && newP2Hp <= 0) winner = 'player1';
    else if (newP1Hp <= 0) winner = 'player2';
    else if (newP2Hp <= 0) winner = 'player1';

    const nextRound = prev.currentRound + 1;
    const dsAvailable = nextRound >= DOUBLE_STRIKE_UNLOCK_ROUND;

    return {
      ...prev,
      player1Hp: newP1Hp,
      player2Hp: newP2Hp,
      player1Action: p1Action,
      player2Action: p2Action,
      roundHistory: [...prev.roundHistory, result],
      currentRound: nextRound,
      phase: winner ? 'gameover' : 'reveal',
      winner,
      doubleStrikeAvailable: dsAvailable,
    };
  }, []);

  const submitAction = useCallback((action: PlayerAction) => {
    setGameState(prev => {
      if (!prev) return prev;

      if (prev.isVsAI) {
        const aiAction = aiSelectAction(prev.player2, prev.currentRound, prev.doubleStrikeAvailable);
        return resolveRound(prev, action, aiAction);
      }

      return { ...prev, player1Action: action };
    });
  }, [resolveRound]);

  const submitPlayer2Action = useCallback((action: PlayerAction) => {
    setGameState(prev => {
      if (!prev || !prev.player1Action) return prev;
      return resolveRound(prev, prev.player1Action, action);
    });
  }, [resolveRound]);

  const confirmReveal = useCallback(() => {
    setGameState(prev => {
      if (!prev) return prev;
      return { ...prev, phase: 'select-action', player1Action: null, player2Action: null };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(null);
  }, []);

  return { gameState, startGame, submitAction, submitPlayer2Action, confirmReveal, resetGame };
}
