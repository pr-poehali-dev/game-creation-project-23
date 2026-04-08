import { Character } from '@/types/game';

export const CHARACTERS: Character[] = [
  {
    id: 'kira',
    name: 'Кира',
    title: 'Безжалостная',
    image: 'https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/310eb329-4f2c-44a3-a630-d68fe4d2677a.jpg',
    avatarImage: 'https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/310eb329-4f2c-44a3-a630-d68fe4d2677a.jpg',
    maxHp: 100,
    attackPower: { head: 35, body: 20, legs: 12 },
    color: '#e53e3e',
    specialAbilities: [],
  },
  {
    id: 'rex',
    name: 'Рекс',
    title: 'Разрушитель',
    image: 'https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/c362b561-ee85-4786-9bf3-eef895ed01a6.jpg',
    avatarImage: 'https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/c362b561-ee85-4786-9bf3-eef895ed01a6.jpg',
    maxHp: 120,
    attackPower: { head: 40, body: 25, legs: 15 },
    color: '#3182ce',
    specialAbilities: [],
  },
  {
    id: 'shadow',
    name: 'Тень',
    title: 'Призрак арены',
    image: 'https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/1d71f3ff-7bac-4fce-9ada-0653b42d057a.jpg',
    avatarImage: 'https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/1d71f3ff-7bac-4fce-9ada-0653b42d057a.jpg',
    maxHp: 90,
    attackPower: { head: 38, body: 22, legs: 14 },
    color: '#805ad5',
    specialAbilities: [],
  },
];

export const ARENA_IMAGE = 'https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/c6b68ccf-5a03-4f8c-a83a-bf9e5c3bd339.jpg';

export const HIT_ZONES = [
  { zone: 'head' as const, label: 'Голова', damage: 'high', emoji: '💢', description: '×1.0 урон' },
  { zone: 'body' as const, label: 'Тело', damage: 'medium', emoji: '👊', description: '×0.6 урон' },
  { zone: 'legs' as const, label: 'Ноги', damage: 'low', emoji: '🦵', description: '×0.4 урон' },
];
