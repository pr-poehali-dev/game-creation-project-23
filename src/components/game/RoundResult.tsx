import { RoundResult as RR, Character } from '@/types/game';

interface RoundResultProps {
  result: RR;
  player1: Character;
  player2: Character;
  onContinue: () => void;
}

const zoneLabel: Record<string, string> = { head: 'Голова', body: 'Тело', legs: 'Ноги' };
const zoneEmoji: Record<string, string> = { head: '💢', body: '👊', legs: '🦵' };

function ActionDesc({ action, char, blocked, damage }: { action: { type: string; zone: string; specialId?: string }, char: Character, blocked: boolean, damage: number }) {
  const special = action.type === 'special' ? char.specialAbilities.find(s => s.id === action.specialId) : null;
  if (action.type === 'attack' || action.type === 'special') {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm">
          {special ? <span>{special.icon}</span> : <span>{zoneEmoji[action.zone]}</span>}
          <span className="font-bold text-white">{special ? special.name : `Удар в ${zoneLabel[action.zone]}`}</span>
          {blocked ? (
            <span className="text-green-400 text-xs font-bold">🛡️ ЗАБЛОКИРОВАН</span>
          ) : (
            <span className="text-red-400 text-xs font-bold">-{damage} HP</span>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-sm">
      <span>🛡️</span>
      <span className="text-green-400 font-bold">Блок {zoneLabel[action.zone]}</span>
    </div>
  );
}

export default function RoundResult({ result, player1, player2, onContinue }: RoundResultProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-lg mx-4 p-6 rounded-sm"
        style={{ background: '#0d0d15', border: '2px solid #ff2020', boxShadow: '0 0 60px #ff000044' }}>
        <div className="text-center mb-6">
          <div className="text-2xl font-black uppercase tracking-widest text-white"
            style={{ fontFamily: 'Impact, sans-serif', textShadow: '0 0 20px #ff000088' }}>
            РА УНД {result.round}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col gap-2 p-3 rounded-sm" style={{ background: `${player1.color}22`, border: `1px solid ${player1.color}44` }}>
            <div className="font-black text-sm uppercase tracking-wider" style={{ color: player1.color }}>{player1.name}</div>
            <ActionDesc action={result.player1Action} char={player1} blocked={result.player1Blocked} damage={result.player1Damage} />
            <div className="text-xs text-gray-500 mt-1">HP: <span className="text-white font-bold">{result.player1Hp}</span></div>
          </div>

          <div className="flex flex-col gap-2 p-3 rounded-sm" style={{ background: `${player2.color}22`, border: `1px solid ${player2.color}44` }}>
            <div className="font-black text-sm uppercase tracking-wider" style={{ color: player2.color }}>{player2.name}</div>
            <ActionDesc action={result.player2Action} char={player2} blocked={result.player2Blocked} damage={result.player2Damage} />
            <div className="text-xs text-gray-500 mt-1">HP: <span className="text-white font-bold">{result.player2Hp}</span></div>
          </div>
        </div>

        {result.specialUsed && (
          <div className="text-center text-yellow-400 text-sm font-bold mb-4 animate-pulse">
            💥 СПЕЦУДАР: {result.specialUsed}
          </div>
        )}

        <button onClick={onContinue}
          className="w-full py-3 text-lg font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #7f0000, #cc0000)',
            border: '2px solid #ff2020',
            boxShadow: '0 0 20px #ff000066',
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
          }}>
          ⚔️ СЛЕДУЮЩИЙ РА УНД
        </button>
      </div>
    </div>
  );
}
