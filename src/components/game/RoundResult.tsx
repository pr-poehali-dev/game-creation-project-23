import { RoundResult as RR, Character, HitZone } from '@/types/game';

interface RoundResultProps {
  result: RR;
  player1: Character;
  player2: Character;
  onContinue: () => void;
}

const zoneLabel: Record<HitZone, string> = { head: 'Голова', body: 'Тело', legs: 'Ноги' };
const zoneEmoji: Record<HitZone, string> = { head: '💢', body: '👊', legs: '🦵' };

function ActionSummary({ action, char, hits, color }: {
  action: RR['player1Action'];
  char: Character;
  hits: RR['player1Hits'];
  color: string;
}) {
  const blocks = action.useDoubleStrike
    ? (action.doubleStrikeBlockZone ? [action.doubleStrikeBlockZone] : [])
    : action.blockZones;

  const attackZones = action.useDoubleStrike && action.doubleStrikeZones
    ? action.doubleStrikeZones
    : action.attackZone ? [action.attackZone] : [];

  return (
    <div className="flex flex-col gap-2 p-3 rounded-sm" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
      <div className="font-black text-sm uppercase tracking-wider" style={{ color }}>{char.name}</div>

      {action.useDoubleStrike && (
        <div className="text-xs font-bold text-orange-400 uppercase">💥 Двойной удар</div>
      )}

      {attackZones.length > 0 ? (
        <div className="flex flex-col gap-1">
          {attackZones.map((z, i) => {
            const hit = hits[i];
            return (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span>{zoneEmoji[z]}</span>
                <span className="text-gray-300">{zoneLabel[z]}</span>
                {hit ? (
                  hit.blocked
                    ? <span className="text-green-400 text-xs font-bold ml-auto">🛡️ заблок.</span>
                    : <span className="text-red-400 text-xs font-bold ml-auto">-{hit.damage} HP</span>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-600 text-xs">Без атаки</div>
      )}

      {blocks.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap mt-1">
          <span className="text-green-500 text-xs">🛡️</span>
          {blocks.map(z => (
            <span key={z} className="text-green-400 text-xs font-bold bg-green-900/30 px-1.5 py-0.5 rounded">
              {zoneLabel[z]}
            </span>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-1">
        HP: <span className="text-white font-bold">{action === undefined ? '—' : ''}{hits.reduce((s, h) => s + h.damage, 0) > 0
          ? <span className="text-red-400">-{hits.reduce((s, h) => s + h.damage, 0)}</span>
          : null}
        </span>
      </div>
    </div>
  );
}

export default function RoundResult({ result, player1, player2, onContinue }: RoundResultProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg p-6 rounded-sm"
        style={{ background: '#0d0d15', border: '2px solid #ff2020', boxShadow: '0 0 60px #ff000044' }}>
        <div className="text-center mb-4">
          <div className="text-2xl font-black uppercase tracking-widest text-white"
            style={{ fontFamily: 'Impact, sans-serif', textShadow: '0 0 20px #ff000088' }}>
            РАУНД {result.round}
          </div>
          {result.doubleStrikeUsedBy && (
            <div className="text-orange-400 text-sm font-bold animate-pulse mt-1">
              💥 {result.doubleStrikeUsedBy === 'player1' ? player1.name : player2.name} использует Двойной удар!
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-2 p-3 rounded-sm" style={{ background: `${player1.color}22`, border: `1px solid ${player1.color}44` }}>
            <div className="font-black text-sm uppercase tracking-wider" style={{ color: player1.color }}>{player1.name}</div>

            {(result.player1Action.useDoubleStrike ? result.player1Action.doubleStrikeZones! : result.player1Action.attackZone ? [result.player1Action.attackZone] : []).length > 0 ? (
              <div className="flex flex-col gap-1">
                {(result.player1Action.useDoubleStrike ? result.player1Action.doubleStrikeZones! : [result.player1Action.attackZone!]).map((z, i) => {
                  const hit = result.player2Hits[i];
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span>{zoneEmoji[z]}</span>
                      <span className="text-gray-300">{zoneLabel[z]}</span>
                      {hit && (hit.blocked
                        ? <span className="text-green-400 font-bold ml-auto">🛡️</span>
                        : <span className="text-red-400 font-bold ml-auto">-{hit.damage}</span>)}
                    </div>
                  );
                })}
              </div>
            ) : <div className="text-gray-600 text-xs">Без атаки</div>}

            {(() => {
              const bs = result.player1Action.useDoubleStrike
                ? (result.player1Action.doubleStrikeBlockZone ? [result.player1Action.doubleStrikeBlockZone] : [])
                : result.player1Action.blockZones;
              return bs.length > 0 ? (
                <div className="flex gap-1 flex-wrap">
                  {bs.map(z => <span key={z} className="text-green-400 text-xs bg-green-900/30 px-1 rounded">🛡️{zoneLabel[z]}</span>)}
                </div>
              ) : null;
            })()}

            <div className="text-xs text-gray-500">
              HP: <span className="text-white font-bold">{result.player1Hp}</span>
              {result.player1TotalDamage > 0 && <span className="text-red-400 ml-1">(-{result.player1TotalDamage})</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2 p-3 rounded-sm" style={{ background: `${player2.color}22`, border: `1px solid ${player2.color}44` }}>
            <div className="font-black text-sm uppercase tracking-wider" style={{ color: player2.color }}>{player2.name}</div>

            {(result.player2Action.useDoubleStrike ? result.player2Action.doubleStrikeZones! : result.player2Action.attackZone ? [result.player2Action.attackZone] : []).length > 0 ? (
              <div className="flex flex-col gap-1">
                {(result.player2Action.useDoubleStrike ? result.player2Action.doubleStrikeZones! : [result.player2Action.attackZone!]).map((z, i) => {
                  const hit = result.player1Hits[i];
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span>{zoneEmoji[z]}</span>
                      <span className="text-gray-300">{zoneLabel[z]}</span>
                      {hit && (hit.blocked
                        ? <span className="text-green-400 font-bold ml-auto">🛡️</span>
                        : <span className="text-red-400 font-bold ml-auto">-{hit.damage}</span>)}
                    </div>
                  );
                })}
              </div>
            ) : <div className="text-gray-600 text-xs">Без атаки</div>}

            {(() => {
              const bs = result.player2Action.useDoubleStrike
                ? (result.player2Action.doubleStrikeBlockZone ? [result.player2Action.doubleStrikeBlockZone] : [])
                : result.player2Action.blockZones;
              return bs.length > 0 ? (
                <div className="flex gap-1 flex-wrap">
                  {bs.map(z => <span key={z} className="text-green-400 text-xs bg-green-900/30 px-1 rounded">🛡️{zoneLabel[z]}</span>)}
                </div>
              ) : null;
            })()}

            <div className="text-xs text-gray-500">
              HP: <span className="text-white font-bold">{result.player2Hp}</span>
              {result.player2TotalDamage > 0 && <span className="text-red-400 ml-1">(-{result.player2TotalDamage})</span>}
            </div>
          </div>
        </div>

        <button onClick={onContinue}
          className="w-full py-3 text-lg font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #7f0000, #cc0000)',
            border: '2px solid #ff2020',
            boxShadow: '0 0 20px #ff000066',
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
          }}>
          ⚔️ СЛЕДУЮЩИЙ РАУНД
        </button>
      </div>
    </div>
  );
}
