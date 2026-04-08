import { useState } from 'react';
import { PlayerAction, HitZone } from '@/types/game';
import { HIT_ZONES } from '@/data/characters';

interface ActionPanelProps {
  onSubmit: (action: PlayerAction) => void;
  playerName: string;
  playerColor: string;
  disabled?: boolean;
  label?: string;
  doubleStrikeAvailable: boolean;
}

const ZONES: HitZone[] = ['head', 'body', 'legs'];

export default function ActionPanel({ onSubmit, playerName, playerColor, disabled, label, doubleStrikeAvailable }: ActionPanelProps) {
  const [mode, setMode] = useState<'normal' | 'double'>('normal');
  const [attackZone, setAttackZone] = useState<HitZone | null>(null);
  const [blockZones, setBlockZones] = useState<HitZone[]>([]);
  const [ds1, setDs1] = useState<HitZone>('head');
  const [ds2, setDs2] = useState<HitZone>('body');
  const [dsBlock, setDsBlock] = useState<HitZone | null>(null);

  const toggleBlock = (z: HitZone) => {
    setBlockZones(prev => {
      if (prev.includes(z)) return prev.filter(b => b !== z);
      if (prev.length >= 2) return prev;
      return [...prev, z];
    });
  };

  const handleConfirm = () => {
    if (disabled) return;
    if (mode === 'double') {
      onSubmit({
        attackZone: null,
        blockZones: [],
        useDoubleStrike: true,
        doubleStrikeZones: [ds1, ds2],
        doubleStrikeBlockZone: dsBlock,
      });
    } else {
      onSubmit({
        attackZone,
        blockZones,
        useDoubleStrike: false,
        doubleStrikeZones: null,
        doubleStrikeBlockZone: null,
      });
    }
    setAttackZone(null);
    setBlockZones([]);
    setDsBlock(null);
  };

  const zoneInfo = (z: HitZone) => HIT_ZONES.find(h => h.zone === z)!;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-sm"
      style={{ background: '#0d0d15', border: `2px solid ${playerColor}44` }}>
      <div className="text-center text-sm font-bold uppercase tracking-widest" style={{ color: playerColor }}>
        {label || playerName}
      </div>

      {doubleStrikeAvailable && (
        <div className="flex gap-2 justify-center">
          {(['normal', 'double'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all"
              style={{
                background: mode === m ? (m === 'double' ? '#4a1a00' : '#1a1a2e') : '#111',
                border: `2px solid ${mode === m ? (m === 'double' ? '#ff6600' : playerColor) : '#333'}`,
                color: mode === m ? '#fff' : '#555',
                clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)',
              }}>
              {m === 'double' ? '💥 Двойной удар' : '⚔️ Обычный ход'}
            </button>
          ))}
        </div>
      )}

      {mode === 'normal' && (
        <>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">
              ⚔️ Атака <span className="text-gray-600">(выбери зону или пропусти)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ZONES.map(z => {
                const info = zoneInfo(z);
                const active = attackZone === z;
                return (
                  <button key={z} onClick={() => setAttackZone(prev => prev === z ? null : z)}
                    className="flex flex-col items-center gap-1 py-2 px-1 transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: active ? '#7f000044' : '#111',
                      border: `2px solid ${active ? '#ff2020' : '#333'}`,
                      boxShadow: active ? '0 0 12px #ff202044' : 'none',
                      clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                    }}>
                    <span className="text-lg">{info.emoji}</span>
                    <span className="text-white text-xs font-bold uppercase">{info.label}</span>
                    <span className="text-gray-500 text-xs">{info.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">
              🛡️ Блок <span className="text-gray-600">(до 2-х зон)</span>
              <span className="ml-2 text-green-600">{blockZones.length}/2</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ZONES.map(z => {
                const info = zoneInfo(z);
                const active = blockZones.includes(z);
                return (
                  <button key={z} onClick={() => toggleBlock(z)}
                    className="flex flex-col items-center gap-1 py-2 px-1 transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: active ? '#003a0044' : '#111',
                      border: `2px solid ${active ? '#22c55e' : '#333'}`,
                      boxShadow: active ? '0 0 12px #22c55e44' : 'none',
                      clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                    }}>
                    <span className="text-lg">🛡️</span>
                    <span className="text-white text-xs font-bold uppercase">{info.label}</span>
                    {active && <span className="text-green-400 text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-gray-600 text-center">
            {attackZone ? `Удар в ${zoneInfo(attackZone).label}` : 'Без атаки'}
            {blockZones.length > 0 ? ` · Блок: ${blockZones.map(z => zoneInfo(z).label).join(', ')}` : ' · Без блока'}
          </div>
        </>
      )}

      {mode === 'double' && (
        <>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">💥 Первый удар</div>
            <div className="grid grid-cols-3 gap-2">
              {ZONES.map(z => {
                const info = zoneInfo(z);
                return (
                  <button key={z} onClick={() => setDs1(z)}
                    className="flex flex-col items-center gap-1 py-2 px-1 transition-all hover:scale-105"
                    style={{
                      background: ds1 === z ? '#4a1a0044' : '#111',
                      border: `2px solid ${ds1 === z ? '#ff6600' : '#333'}`,
                      clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                    }}>
                    <span className="text-lg">{info.emoji}</span>
                    <span className="text-white text-xs font-bold uppercase">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">💥 Второй удар</div>
            <div className="grid grid-cols-3 gap-2">
              {ZONES.map(z => {
                const info = zoneInfo(z);
                return (
                  <button key={z} onClick={() => setDs2(z)}
                    className="flex flex-col items-center gap-1 py-2 px-1 transition-all hover:scale-105"
                    style={{
                      background: ds2 === z ? '#4a1a0044' : '#111',
                      border: `2px solid ${ds2 === z ? '#ff6600' : '#333'}`,
                      clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                    }}>
                    <span className="text-lg">{info.emoji}</span>
                    <span className="text-white text-xs font-bold uppercase">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">
              🛡️ Блок <span className="text-gray-600">(только 1 зона)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ZONES.map(z => {
                const info = zoneInfo(z);
                return (
                  <button key={z} onClick={() => setDsBlock(prev => prev === z ? null : z)}
                    className="flex flex-col items-center gap-1 py-2 px-1 transition-all hover:scale-105"
                    style={{
                      background: dsBlock === z ? '#003a0044' : '#111',
                      border: `2px solid ${dsBlock === z ? '#22c55e' : '#333'}`,
                      clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                    }}>
                    <span className="text-lg">🛡️</span>
                    <span className="text-white text-xs font-bold uppercase">{info.label}</span>
                    {dsBlock === z && <span className="text-green-400 text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-orange-400 text-center">
            💥 {zoneInfo(ds1).label} + {zoneInfo(ds2).label}
            {dsBlock ? ` · 🛡️ ${zoneInfo(dsBlock).label}` : ' · Без блока'}
          </div>
        </>
      )}

      <button onClick={handleConfirm} disabled={disabled}
        className="w-full py-3 text-base font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: disabled ? '#333' : mode === 'double'
            ? 'linear-gradient(135deg, #7f3300, #ff6600)'
            : `linear-gradient(135deg, ${playerColor}99, ${playerColor})`,
          border: `2px solid ${disabled ? '#555' : mode === 'double' ? '#ff6600' : playerColor}`,
          boxShadow: disabled ? 'none' : `0 0 20px ${mode === 'double' ? '#ff660066' : playerColor + '66'}`,
          clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
        }}>
        {mode === 'double' ? '💥 ДВОЙНОЙ УДАР' : '⚔️ ПОДТВЕРДИТЬ ХОД'}
      </button>
    </div>
  );
}
