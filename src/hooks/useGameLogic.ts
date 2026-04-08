import { useState, useCallback } from 'react';
import { GameState, PlayerAction, RoundResult, Character, SpecialAbility, HitZone } from '@/types/game';

const BLOCK_REDUCTION = 0.85;
const SPECIAL_IGNORE_BLOCK_IDS = ['death-strike'];

function calcDamage(attacker: Character, zone: HitZone, specialAbility?: SpecialAbility): number {
  if (specialAbility) return specialAbility.damage;
  return attacker.attackPower[zone];
}

function aiSelectAction(character: Character, opponentHp: number, specials: SpecialAbility[]): PlayerAction {
  const availableSpecials = specials.filter(s => s.currentCooldown === 0);
  if (availableSpecials.length > 0 && Math.random() < 0.35) {
    const special = availableSpecials[Math.floor(Math.random() * availableSpecials.length)];
    return { type: 'special', zone: 'head', specialId: special.id };
  }
  const rand = Math.random();
  if (rand < 0.55) {
    const zones: HitZone[] = ['head', 'body', 'legs'];
    const weights = [0.5, 0.35, 0.15];
    let r = Math.random();
    let zone: HitZone = 'head';
    for (let i = 0; i < zones.length; i++) {
      if (r < weights[i]) { zone = zones[i]; break; }
      r -= weights[i];
    }
    return { type: 'attack', zone };
  } else {
    const zones: HitZone[] = ['head', 'body', 'legs'];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    return { type: 'block', zone };
  }
}

function tickCooldowns(specials: SpecialAbility[]): SpecialAbility[] {
  return specials.map(s => ({ ...s, currentCooldown: Math.max(0, s.currentCooldown - 1) }));
}

function applyCooldown(specials: SpecialAbility[], usedId?: string): SpecialAbility[] {
  return specials.map(s => s.id === usedId ? { ...s, currentCooldown: s.cooldown } : s);
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
      player1Specials: p1.specialAbilities.map(s => ({ ...s, currentCooldown: 0 })),
      player2Specials: p2.specialAbilities.map(s => ({ ...s, currentCooldown: 0 })),
      isVsAI: vsAI,
    });
  }, []);

  const submitAction = useCallback((action: PlayerAction) => {
    setGameState(prev => {
      if (!prev) return prev;

      let aiAction: PlayerAction | null = null;
      if (prev.isVsAI) {
        aiAction = aiSelectAction(prev.player2, prev.player1Hp, prev.player2Specials);
      }

      const p1Action = action;
      const p2Action = aiAction || prev.player2Action;

      if (!p2Action) {
        return { ...prev, player1Action: p1Action };
      }

      const p1Special = p1Action.type === 'special' ? prev.player1Specials.find(s => s.id === p1Action.specialId) : undefined;
      const p2Special = p2Action.type === 'special' ? prev.player2Specials.find(s => s.id === p2Action.specialId) : undefined;

      const ignoreBlockP1 = p1Action.type === 'special' && p1Action.specialId && SPECIAL_IGNORE_BLOCK_IDS.includes(p1Action.specialId);
      const ignoreBlockP2 = p2Action.type === 'special' && p2Action.specialId && SPECIAL_IGNORE_BLOCK_IDS.includes(p2Action.specialId);

      const p2Blocked = p2Action.type === 'block' && p2Action.zone === p1Action.zone && !ignoreBlockP1;
      const p1Blocked = p1Action.type === 'block' && p1Action.zone === p2Action.zone && !ignoreBlockP2;

      let p1DmgDealt = 0;
      let p2DmgDealt = 0;

      if (p1Action.type === 'attack' || p1Action.type === 'special') {
        p1DmgDealt = calcDamage(prev.player1, p1Action.zone, p1Special);
        if (p2Blocked) p1DmgDealt = Math.round(p1DmgDealt * (1 - BLOCK_REDUCTION));
      }

      if (p2Action.type === 'attack' || p2Action.type === 'special') {
        p2DmgDealt = calcDamage(prev.player2, p2Action.zone, p2Special);
        if (p1Blocked) p2DmgDealt = Math.round(p2DmgDealt * (1 - BLOCK_REDUCTION));
      }

      const newP1Hp = Math.max(0, prev.player1Hp - p2DmgDealt);
      const newP2Hp = Math.max(0, prev.player2Hp - p1DmgDealt);

      const result: RoundResult = {
        round: prev.currentRound,
        player1Action: p1Action,
        player2Action: p2Action,
        player1Damage: p2DmgDealt,
        player2Damage: p1DmgDealt,
        player1Hp: newP1Hp,
        player2Hp: newP2Hp,
        player1Blocked: p1Blocked,
        player2Blocked: p2Blocked,
        specialUsed: p1Special?.name || p2Special?.name,
      };

      let winner: 'player1' | 'player2' | null = null;
      if (newP1Hp <= 0 && newP2Hp <= 0) winner = 'player1';
      else if (newP1Hp <= 0) winner = 'player2';
      else if (newP2Hp <= 0) winner = 'player1';

      const newP1Specials = tickCooldowns(applyCooldown(prev.player1Specials, p1Action.specialId));
      const newP2Specials = tickCooldowns(applyCooldown(prev.player2Specials, p2Action.specialId));

      return {
        ...prev,
        player1Hp: newP1Hp,
        player2Hp: newP2Hp,
        player1Action: p1Action,
        player2Action: p2Action,
        roundHistory: [...prev.roundHistory, result],
        currentRound: prev.currentRound + 1,
        phase: winner ? 'gameover' : 'reveal',
        winner,
        player1Specials: newP1Specials,
        player2Specials: newP2Specials,
      };
    });
  }, []);

  const submitPlayer2Action = useCallback((action: PlayerAction) => {
    setGameState(prev => {
      if (!prev) return prev;
      return { ...prev, player2Action: action };
    });
  }, []);

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
