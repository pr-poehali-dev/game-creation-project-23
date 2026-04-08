import { BattleRecord } from '@/types/game';
import { CHARACTERS } from '@/data/characters';

interface StatsPageProps {
  records: BattleRecord[];
  onBack: () => void;
  playerName: string;
}

export default function StatsPage({ records, onBack, playerName }: StatsPageProps) {
  const aiGames = records.filter(r => r.mode === 'ai');
  const pvpGames = records.filter(r => r.mode === 'pvp');
  const wins = records.filter(r => r.winner === records[0]?.player1Name).length;
  const totalRounds = records.reduce((sum, r) => sum + r.rounds, 0);
  const avgRounds = records.length > 0 ? (totalRounds / records.length).toFixed(1) : '—';

  const charWins: Record<string, number> = {};
  records.forEach(r => {
    charWins[r.winner] = (charWins[r.winner] || 0) + 1;
  });
  const topFighter = Object.entries(charWins).sort((a, b) => b[1] - a[1])[0];

  const StatCard = ({ label, value, color = '#fff', sub }: { label: string; value: string | number; color?: string; sub?: string }) => (
    <div className="flex flex-col items-center justify-center p-4 rounded-sm"
      style={{ background: '#111118', border: '1px solid #2a2a3a' }}>
      <div className="text-3xl font-black" style={{ color, fontFamily: 'Impact, sans-serif' }}>{value}</div>
      <div className="text-gray-400 text-xs uppercase tracking-widest mt-1">{label}</div>
      {sub && <div className="text-gray-600 text-xs mt-0.5">{sub}</div>}
    </div>
  );

  return (
    <div className="relative min-h-screen" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: `url('https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/c6b68ccf-5a03-4f8c-a83a-bf9e5c3bd339.jpg')`, backgroundSize: 'cover' }} />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="text-gray-400 hover:text-white text-2xl transition-colors">←</button>
          <h2 className="text-3xl font-black uppercase tracking-widest text-white"
            style={{ fontFamily: 'Impact, sans-serif', textShadow: '0 0 20px #ff000066' }}>
            📊 СТАТИСТИКА
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard label="Всего боёв" value={records.length} color="#fff" />
          <StatCard label="Всего раундов" value={totalRounds} color="#f59e0b" />
          <StatCard label="Против ИИ" value={aiGames.length} color="#6699ff" />
          <StatCard label="PvP боёв" value={pvpGames.length} color="#44ff88" />
          <StatCard label="Ср. раундов/бой" value={avgRounds} color="#cc88ff" />
          <StatCard label="Лучший боец" value={topFighter?.[0] || '—'} color="#ff2020" sub={topFighter ? `${topFighter[1]} побед` : undefined} />
        </div>

        <div className="p-4 rounded-sm mb-4" style={{ background: '#111118', border: '1px solid #2a2a3a' }}>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Характеристики бойцов</div>
          <div className="flex flex-col gap-3">
            {CHARACTERS.map(char => (
              <div key={char.id} className="flex items-center gap-3">
                <img src={char.avatarImage} alt={char.name} className="w-10 h-10 object-cover object-top rounded-sm"
                  style={{ border: `2px solid ${char.color}44` }} />
                <div className="flex-1">
                  <div className="text-white text-sm font-bold">{char.name}</div>
                  <div className="text-xs" style={{ color: char.color }}>{char.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 text-sm font-bold">{charWins[char.name] || 0} побед</div>
                  <div className="text-gray-600 text-xs">HP: {char.maxHp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
