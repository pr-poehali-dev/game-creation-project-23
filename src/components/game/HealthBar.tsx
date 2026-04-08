interface HealthBarProps {
  hp: number;
  maxHp: number;
  name: string;
  color: string;
  reversed?: boolean;
}

export default function HealthBar({ hp, maxHp, name, color, reversed }: HealthBarProps) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const barColor = pct > 50 ? '#22c55e' : pct > 25 ? '#f59e0b' : '#ef4444';

  return (
    <div className={`flex flex-col gap-1 flex-1 ${reversed ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-center gap-2 ${reversed ? 'flex-row-reverse' : ''}`}>
        <span className="text-white font-black text-lg uppercase tracking-wider" style={{ fontFamily: 'Impact, sans-serif', textShadow: `0 0 10px ${color}` }}>
          {name}
        </span>
        <span className="text-gray-300 font-bold text-sm">{hp}</span>
      </div>
      <div className="w-full h-5 bg-gray-900 rounded-sm overflow-hidden relative"
        style={{ border: '2px solid #333', transform: reversed ? 'scaleX(-1)' : undefined }}>
        <div
          className="h-full transition-all duration-500 relative"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${barColor}bb, ${barColor})`,
            boxShadow: `0 0 10px ${barColor}88`,
          }}>
          <div className="absolute inset-y-0 right-0 w-2 bg-white/30" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/70">
          {Math.round(pct)}%
        </div>
      </div>
    </div>
  );
}
