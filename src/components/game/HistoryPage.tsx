import { BattleRecord } from '@/types/game';

interface HistoryPageProps {
  records: BattleRecord[];
  onBack: () => void;
  onClear: () => void;
}

export default function HistoryPage({ records, onBack, onClear }: HistoryPageProps) {
  return (
    <div className="relative min-h-screen" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: `url('https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/c6b68ccf-5a03-4f8c-a83a-bf9e5c3bd339.jpg')`, backgroundSize: 'cover' }} />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white text-2xl transition-colors">←</button>
            <h2 className="text-3xl font-black uppercase tracking-widest text-white"
              style={{ fontFamily: 'Impact, sans-serif', textShadow: '0 0 20px #ff000066' }}>
              🏆 ИСТОРИЯ ПОБЕД
            </h2>
          </div>
          {records.length > 0 && (
            <button onClick={onClear}
              className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-red-400 border border-red-900 hover:bg-red-900/20 transition-colors rounded-sm">
              Очистить
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚔️</div>
            <div className="text-gray-500 text-lg uppercase tracking-widest">Ещё нет сыгранных боёв</div>
            <div className="text-gray-700 text-sm mt-2">Выйди на арену и докажи свою силу</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {[...records].reverse().map(rec => (
              <div key={rec.id} className="p-4 rounded-sm"
                style={{ background: '#111118', border: '1px solid #2a2a3a' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 text-lg">🏆</span>
                    <span className="text-white font-black uppercase tracking-wider">{rec.winner}</span>
                    <span className="text-gray-500 text-sm">победил</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-sm font-bold uppercase"
                      style={{ background: rec.mode === 'ai' ? '#1a1a4a' : '#1a3a1a', color: rec.mode === 'ai' ? '#6699ff' : '#44ff88', border: `1px solid ${rec.mode === 'ai' ? '#4466ff44' : '#44ff8844'}` }}>
                      {rec.mode === 'ai' ? '🤖 ИИ' : '👥 PvP'}
                    </span>
                    <span className="text-gray-600 text-xs">{rec.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-red-400">{rec.player1Name}</span>
                  <span>VS</span>
                  <span className="text-blue-400">{rec.player2Name}</span>
                  <span className="ml-auto text-gray-600">{rec.rounds} раундов</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
