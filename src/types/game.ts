export type HitZone = 'head' | 'body' | 'legs';
export type GameScreen = 'menu' | 'character-select' | 'arena' | 'victory' | 'history' | 'stats' | 'settings';

export interface SpecialAbility {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  image: string;
  avatarImage: string;
  maxHp: number;
  attackPower: { head: number; body: number; legs: number };
  color: string;
  specialAbilities: SpecialAbility[];
}

// Одно действие за ход:
// - attackZone: куда бьём (null = не атакуем)
// - blockZones: какие зоны блокируем (0–2 зоны)
// - useDoubleStrike: используем ли двойной удар (доступен с 5-го хода)
// - doubleStrikeZones: две зоны для двойного удара
// - doubleStrikeBlockZone: одна зона блока при двойном ударе
export interface PlayerAction {
  attackZone: HitZone | null;
  blockZones: HitZone[];
  useDoubleStrike: boolean;
  doubleStrikeZones: [HitZone, HitZone] | null;
  doubleStrikeBlockZone: HitZone | null;
}

export interface HitResult {
  zone: HitZone;
  damage: number;
  blocked: boolean;
}

export interface RoundResult {
  round: number;
  player1Action: PlayerAction;
  player2Action: PlayerAction;
  player1Hits: HitResult[];
  player2Hits: HitResult[];
  player1TotalDamage: number;
  player2TotalDamage: number;
  player1Hp: number;
  player2Hp: number;
  doubleStrikeUsedBy: 'player1' | 'player2' | null;
}

export interface GameState {
  player1: Character;
  player2: Character;
  player1Hp: number;
  player2Hp: number;
  player1Action: PlayerAction | null;
  player2Action: PlayerAction | null;
  currentRound: number;
  roundHistory: RoundResult[];
  phase: 'select-action' | 'reveal' | 'gameover';
  winner: 'player1' | 'player2' | null;
  doubleStrikeAvailable: boolean;
  isVsAI: boolean;
}

export interface BattleRecord {
  id: string;
  date: string;
  player1Name: string;
  player2Name: string;
  winner: string;
  rounds: number;
  mode: 'pvp' | 'ai';
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  favoriteCharacter: string;
  totalRounds: number;
  avgRoundsPerGame: number;
}
