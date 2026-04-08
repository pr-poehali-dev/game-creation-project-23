import { useState } from 'react';
import { Character, GameScreen } from '@/types/game';
import { CHARACTERS } from '@/data/characters';

interface CharacterSelectProps {
  onStartGame: (p1: Character, p2: Character, vsAI: boolean) => void;
  onBack: () => void;
}

export default function CharacterSelect({ onStartGame, onBack }: CharacterSelectProps) {
  const [selected, setSelected] = useState<Character | null>(null);
  const [mode, setMode] = useState<'ai' | 'pvp'>('ai');

  const handleSelect = (char: Character) => {
    setSelected(char);
  };

  const handleStart = () => {
    if (!selected) return;
    const opponents = CHARACTERS.filter(c => c.id !== selected.id);
    const p2 = opponents[Math.floor(Math.random() * opponents.length)];
    onStartGame(selected, p2, mode === 'ai');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url('https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/c6b68ccf-5a03-4f8c-a83a-bf9e5c3bd339.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-5xl px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors text-2xl">←</button>
          <h2 className="text-3xl font-black uppercase tracking-widest text-white"
            style={{ textShadow: '0 0 20px #ff000066', fontFamily: 'Impact, sans-serif' }}>
            ВЫБОР БОЙЦА
          </h2>
        </div>

        <div className="flex gap-4 mb-8">
          {(['ai', 'pvp'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-6 py-2 font-bold uppercase tracking-wider transition-all"
              style={{
                background: mode === m ? 'linear-gradient(135deg, #7f0000, #cc0000)' : '#1a1a2e',
                border: `2px solid ${mode === m ? '#ff2020' : '#333'}`,
                color: mode === m ? '#fff' : '#888',
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
              }}>
              {m === 'ai' ? '🤖 Против ИИ' : '👥 2 игрока'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHARACTERS.map(char => (
            <div key={char.id} onClick={() => handleSelect(char)}
              className="cursor-pointer transition-all duration-200 hover:scale-105 group"
              style={{
                border: `3px solid ${selected?.id === char.id ? char.color : '#333'}`,
                background: selected?.id === char.id ? `${char.color}22` : '#111118',
                boxShadow: selected?.id === char.id ? `0 0 30px ${char.color}66` : '0 4px 20px #00000088',
                clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
              }}>
              <div className="relative overflow-hidden" style={{ height: 280 }}>
                <img src={char.image} alt={char.name}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, ${char.color}55 0%, transparent 60%)` }} />
                {selected?.id === char.id && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: char.color }}>✓</div>
                )}
              </div>
              <div className="p-4">
                <div className="text-xl font-black uppercase tracking-wide text-white">{char.name}</div>
                <div className="text-sm tracking-widest uppercase mb-3" style={{ color: char.color }}>{char.title}</div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="text-center p-1 rounded" style={{ background: '#1a1a2e' }}>
                    <div className="text-red-400 font-bold">{char.attackPower.head}</div>
                    <div className="text-gray-500">Голова</div>
                  </div>
                  <div className="text-center p-1 rounded" style={{ background: '#1a1a2e' }}>
                    <div className="text-orange-400 font-bold">{char.attackPower.body}</div>
                    <div className="text-gray-500">Тело</div>
                  </div>
                  <div className="text-center p-1 rounded" style={{ background: '#1a1a2e' }}>
                    <div className="text-yellow-400 font-bold">{char.attackPower.legs}</div>
                    <div className="text-gray-500">Ноги</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">HP: <span className="text-green-400 font-bold">{char.maxHp}</span></div>
                <div className="mt-2 text-xs text-gray-500">
                  💥 С 5-го раунда — <span className="text-orange-400 font-bold">Двойной удар</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button onClick={handleStart} disabled={!selected}
            className="px-12 py-4 text-2xl font-black uppercase tracking-widest text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: selected ? 'linear-gradient(135deg, #7f0000, #cc0000)' : '#333',
              border: `2px solid ${selected ? '#ff2020' : '#555'}`,
              boxShadow: selected ? '0 0 30px #ff000066' : 'none',
              clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
            }}>
            {selected ? `⚔️ СРАЖАТЬСЯ КАК ${selected.name.toUpperCase()}` : 'ВЫБЕРИ БОЙЦА'}
          </button>
        </div>
      </div>
    </div>
  );
}