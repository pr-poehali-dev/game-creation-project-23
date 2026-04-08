import { useState } from 'react';

interface Settings {
  playerName: string;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  aiDifficulty: 'easy' | 'normal' | 'hard';
}

interface SettingsPageProps {
  settings: Settings;
  onSave: (s: Settings) => void;
  onBack: () => void;
}

export default function SettingsPage({ settings, onSave, onBack }: SettingsPageProps) {
  const [local, setLocal] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between p-4 rounded-sm" style={{ background: '#111118', border: '1px solid #2a2a3a' }}>
      <span className="text-white text-sm font-bold uppercase tracking-wider">{label}</span>
      <button onClick={() => onChange(!value)}
        className="relative w-12 h-6 rounded-full transition-all"
        style={{ background: value ? '#cc0000' : '#2a2a3a', border: `2px solid ${value ? '#ff2020' : '#444'}` }}>
        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: value ? '24px' : '2px', boxShadow: value ? '0 0 8px #ff0000' : 'none' }} />
      </button>
    </div>
  );

  const difficulties = [
    { value: 'easy' as const, label: '😊 Лёгкий', desc: 'ИИ делает случайные ходы' },
    { value: 'normal' as const, label: '😤 Средний', desc: 'ИИ атакует разумно' },
    { value: 'hard' as const, label: '💀 Сложный', desc: 'ИИ использует спецудары' },
  ];

  return (
    <div className="relative min-h-screen" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: `url('https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/c6b68ccf-5a03-4f8c-a83a-bf9e5c3bd339.jpg')`, backgroundSize: 'cover' }} />
      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="text-gray-400 hover:text-white text-2xl transition-colors">←</button>
          <h2 className="text-3xl font-black uppercase tracking-widest text-white"
            style={{ fontFamily: 'Impact, sans-serif', textShadow: '0 0 20px #ff000066' }}>
            ⚙️ НАСТРОЙКИ
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-sm" style={{ background: '#111118', border: '1px solid #2a2a3a' }}>
            <label className="text-white text-sm font-bold uppercase tracking-wider block mb-2">Имя игрока</label>
            <input
              value={local.playerName}
              onChange={e => setLocal(p => ({ ...p, playerName: e.target.value }))}
              maxLength={20}
              className="w-full bg-black/60 text-white px-4 py-2 rounded-sm outline-none text-sm"
              style={{ border: '2px solid #333', fontFamily: 'sans-serif' }}
              placeholder="Введи имя..."
            />
          </div>

          <Toggle label="Анимации" value={local.animationsEnabled} onChange={v => setLocal(p => ({ ...p, animationsEnabled: v }))} />
          <Toggle label="Звук (скоро)" value={local.soundEnabled} onChange={v => setLocal(p => ({ ...p, soundEnabled: v }))} />

          <div className="p-4 rounded-sm" style={{ background: '#111118', border: '1px solid #2a2a3a' }}>
            <div className="text-white text-sm font-bold uppercase tracking-wider mb-3">Сложность ИИ</div>
            <div className="flex flex-col gap-2">
              {difficulties.map(d => (
                <button key={d.value} onClick={() => setLocal(p => ({ ...p, aiDifficulty: d.value }))}
                  className="flex items-center justify-between p-3 rounded-sm transition-all text-left"
                  style={{
                    background: local.aiDifficulty === d.value ? '#7f000033' : '#0d0d15',
                    border: `2px solid ${local.aiDifficulty === d.value ? '#ff2020' : '#333'}`,
                  }}>
                  <div>
                    <div className="text-white text-sm font-bold">{d.label}</div>
                    <div className="text-gray-500 text-xs">{d.desc}</div>
                  </div>
                  {local.aiDifficulty === d.value && <span className="text-red-400">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSave}
            className="w-full py-3 text-lg font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background: saved ? 'linear-gradient(135deg, #007f00, #00cc00)' : 'linear-gradient(135deg, #7f0000, #cc0000)',
              border: `2px solid ${saved ? '#00ff00' : '#ff2020'}`,
              boxShadow: `0 0 20px ${saved ? '#00ff0066' : '#ff000066'}`,
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}>
            {saved ? '✓ СОХРАНЕНО' : '💾 СОХРАНИТЬ'}
          </button>
        </div>
      </div>
    </div>
  );
}

export type { Settings };
