export type HitZone = 'head' | 'body' | 'legs';
export type ActionType = 'attack' | 'block' | 'special';
export type GameScreen = 'menu' | 'character-select' | 'arena' | 'victory' | 'history' | 'stats' | 'settings';

export interface SpecialAbility {
  id: string;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  currentCooldown: number;
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

export interface PlayerAction {
  type: ActionType;
  zone: HitZone;
  specialId?: string;
}

export interface RoundResult {
  round: number;
  player1Action: PlayerAction;
  player2Action: PlayerAction;
  player1Damage: number;
  player2Damage: number;
  player1Hp: number;
  player2Hp: number;
  player1Blocked: boolean;
  player2Blocked: boolean;
  specialUsed?: string;
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
  player1Specials: SpecialAbility[];
  player2Specials: SpecialAbility[];
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
