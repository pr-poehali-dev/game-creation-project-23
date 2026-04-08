import { GameScreen } from '@/types/game';

interface MainMenuProps {
  onNavigate: (screen: GameScreen) => void;
}

export default function MainMenu({ onNavigate }: MainMenuProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/c6b68ccf-5a03-4f8c-a83a-bf9e5c3bd339.jpg')` }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 w-full max-w-md">
        <div className="text-center mb-4">
          <h1
            className="text-6xl md:text-7xl font-black uppercase tracking-widest mb-2"
            style={{
              color: '#ff2020',
              textShadow: '0 0 30px #ff000088, 0 4px 0 #000, 0 8px 20px #000',
              fontFamily: 'Impact, sans-serif',
              letterSpacing: '0.12em',
            }}
          >
            BRUTAL
          </h1>
          <h2
            className="text-2xl md:text-3xl font-bold uppercase tracking-[0.3em] text-gray-300"
            style={{ textShadow: '0 2px 8px #000' }}
          >
            ARENA
          </h2>
          <div className="mt-2 text-gray-500 text-sm tracking-widest uppercase">Пошаговый бой</div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => onNavigate('character-select')}
            className="group relative w-full py-4 px-8 text-xl font-black uppercase tracking-widest text-white overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #7f0000, #cc0000)',
              border: '2px solid #ff2020',
              boxShadow: '0 0 20px #ff000044, inset 0 1px 0 #ff555522',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}
          >
            <span className="relative z-10">⚔️ В БОЙ</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => onNavigate('history')}
            className="group relative w-full py-3 px-8 text-lg font-bold uppercase tracking-wider text-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e, #2d2d44)',
              border: '2px solid #444',
              boxShadow: '0 4px 15px #00000066',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}
          >
            🏆 История побед
          </button>

          <button
            onClick={() => onNavigate('stats')}
            className="group relative w-full py-3 px-8 text-lg font-bold uppercase tracking-wider text-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e, #2d2d44)',
              border: '2px solid #444',
              boxShadow: '0 4px 15px #00000066',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}
          >
            📊 Статистика
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="group relative w-full py-3 px-8 text-lg font-bold uppercase tracking-wider text-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e, #2d2d44)',
              border: '2px solid #444',
              boxShadow: '0 4px 15px #00000066',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}
          >
            ⚙️ Настройки
          </button>
        </div>

        <div className="text-gray-600 text-xs tracking-widest uppercase mt-4">
          v1.0 — Brutal Arena
        </div>
      </div>
    </div>
  );
}
