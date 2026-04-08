import { useState } from 'react';
import { PlayerAction, HitZone, SpecialAbility } from '@/types/game';
import { HIT_ZONES } from '@/data/characters';

interface ActionPanelProps {
  onSubmit: (action: PlayerAction) => void;
  specials: SpecialAbility[];
  playerName: string;
  playerColor: string;
  disabled?: boolean;
  label?: string;
}

export default function ActionPanel({ onSubmit, specials, playerName, playerColor, disabled, label }: ActionPanelProps) {
  const [actionType, setActionType] = useState<'attack' | 'block'>('attack');
  const [zone, setZone] = useState<HitZone>('head');
  const [selectedSpecial, setSelectedSpecial] = useState<string | null>(null);

  const handleConfirm = () => {
    if (disabled) return;
    if (selectedSpecial) {
      onSubmit({ type: 'special', zone: 'head', specialId: selectedSpecial });
      setSelectedSpecial(null);
    } else {
      onSubmit({ type: actionType, zone });
    }
  };

  const handleSpecialClick = (s: SpecialAbility) => {
    if (s.currentCooldown > 0 || disabled) return;
    setSelectedSpecial(prev => prev === s.id ? null : s.id);
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-sm"
      style={{ background: '#0d0d15', border: `2px solid ${playerColor}44` }}>
      <div className="text-center text-sm font-bold uppercase tracking-widest" style={{ color: playerColor }}>
        {label || playerName} — выбери действие
      </div>

      {!selectedSpecial && (
        <>
          <div className="flex gap-2 justify-center">
            {(['attack', 'block'] as const).map(t => (
              <button key={t} onClick={() => setActionType(t)}
                className="px-4 py-2 font-bold uppercase text-sm tracking-wider transition-all"
                style={{
                  background: actionType === t ? (t === 'attack' ? '#7f0000' : '#1a3a1a') : '#1a1a2e',
                  border: `2px solid ${actionType === t ? (t === 'attack' ? '#ff2020' : '#22c55e') : '#333'}`,
                  color: actionType === t ? '#fff' : '#666',
                  clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)',
                }}>
                {t === 'attack' ? '⚔️ Удар' : '🛡️ Блок'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {HIT_ZONES.map(({ zone: z, label: zLabel, emoji, description }) => (
              <button key={z} onClick={() => setZone(z)}
                className="flex flex-col items-center gap-1 py-3 px-2 transition-all hover:scale-105 active:scale-95"
                style={{
                  background: zone === z ? `${playerColor}33` : '#111',
                  border: `2px solid ${zone === z ? playerColor : '#333'}`,
                  boxShadow: zone === z ? `0 0 15px ${playerColor}44` : 'none',
                  clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)',
                }}>
                <span className="text-xl">{emoji}</span>
                <span className="text-white text-xs font-bold uppercase">{zLabel}</span>
                <span className="text-gray-500 text-xs">{description}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {specials.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-gray-500 uppercase tracking-widest">Спецудары:</div>
          <div className="flex gap-2 flex-wrap">
            {specials.map(s => (
              <button key={s.id}
                onClick={() => handleSpecialClick(s)}
                disabled={s.currentCooldown > 0 || disabled}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: selectedSpecial === s.id ? `${playerColor}44` : '#1a1a2e',
                  border: `2px solid ${selectedSpecial === s.id ? playerColor : s.currentCooldown > 0 ? '#333' : '#555'}`,
                  color: s.currentCooldown > 0 ? '#555' : selectedSpecial === s.id ? '#fff' : '#aaa',
                  clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)',
                }}>
                <span>{s.icon}</span>
                <span>{s.name}</span>
                {s.currentCooldown > 0 && <span className="text-red-500">({s.currentCooldown})</span>}
              </button>
            ))}
          </div>
          {selectedSpecial && (
            <div className="text-xs text-yellow-400 text-center">
              {specials.find(s => s.id === selectedSpecial)?.description}
            </div>
          )}
        </div>
      )}

      <button onClick={handleConfirm} disabled={disabled}
        className="w-full py-3 text-lg font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: disabled ? '#333' : `linear-gradient(135deg, ${playerColor}99, ${playerColor})`,
          border: `2px solid ${disabled ? '#555' : playerColor}`,
          boxShadow: disabled ? 'none' : `0 0 20px ${playerColor}66`,
          clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
        }}>
        {selectedSpecial ? `💥 СПЕЦУДАР!` : actionType === 'attack' ? `⚔️ АТАКОВАТЬ` : `🛡️ ЗАБЛОКИРОВАТЬ`}
      </button>
    </div>
  );
}
