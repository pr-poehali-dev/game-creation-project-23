import { useState, useEffect } from 'react';
import { GameState, PlayerAction, BattleRecord } from '@/types/game';
import HealthBar from './HealthBar';
import ActionPanel from './ActionPanel';
import RoundResult from './RoundResult';

interface ArenaProps {
  gameState: GameState;
  onSubmitAction: (action: PlayerAction) => void;
  onSubmitP2Action: (action: PlayerAction) => void;
  onConfirmReveal: () => void;
  onBack: () => void;
  onSaveRecord: (record: BattleRecord) => void;
}

export default function Arena({ gameState, onSubmitAction, onSubmitP2Action, onConfirmReveal, onBack, onSaveRecord }: ArenaProps) {
  const { player1, player2, player1Hp, player2Hp, phase, winner, roundHistory, currentRound, isVsAI, player1Specials, player2Specials } = gameState;
  const [p1Submitted, setP1Submitted] = useState(false);
  const [p2Submitted, setP2Submitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [savedRecord, setSavedRecord] = useState(false);

  useEffect(() => {
    if (phase === 'reveal') {
      setShowResult(true);
      setP1Submitted(false);
      setP2Submitted(false);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'gameover' && !savedRecord) {
      setSavedRecord(true);
      const record: BattleRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('ru-RU'),
        player1Name: player1.name,
        player2Name: player2.name,
        winner: winner === 'player1' ? player1.name : player2.name,
        rounds: currentRound - 1,
        mode: isVsAI ? 'ai' : 'pvp',
      };
      onSaveRecord(record);
    }
  }, [phase]);

  const handleP1Action = (action: PlayerAction) => {
    setP1Submitted(true);
    if (isVsAI) {
      onSubmitAction(action);
    } else {
      onSubmitAction(action);
    }
  };

  const handleP2Action = (action: PlayerAction) => {
    setP2Submitted(true);
    onSubmitP2Action(action);
  };

  const handleContinue = () => {
    setShowResult(false);
    onConfirmReveal();
  };

  const lastResult = roundHistory[roundHistory.length - 1];

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/c8707999-7057-4641-a8ab-c0cf820a3b75/files/c6b68ccf-5a03-4f8c-a83a-bf9e5c3bd339.jpg')`,
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3,
        }} />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex flex-col h-full min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-800">
          <button onClick={onBack} className="text-gray-500 hover:text-white text-xl transition-colors">←</button>
          <div className="flex items-center gap-4 flex-1">
            <HealthBar hp={player1Hp} maxHp={player1.maxHp} name={player1.name} color={player1.color} />
            <div className="text-white font-black text-xl px-3 py-1 rounded"
              style={{ background: '#1a0a0a', border: '2px solid #ff2020', fontFamily: 'Impact, sans-serif', minWidth: 80, textAlign: 'center' }}>
              Р{currentRound - 1 || 1}
            </div>
            <HealthBar hp={player2Hp} maxHp={player2.maxHp} name={player2.name} color={player2.color} reversed />
          </div>
        </div>

        {/* Fighters */}
        <div className="flex justify-between items-end flex-1 px-4 pb-4 relative" style={{ minHeight: 220 }}>
          <div className="relative flex flex-col items-center" style={{ width: '35%' }}>
            <img src={player1.image} alt={player1.name}
              className="object-cover object-top rounded-sm"
              style={{
                height: 200, width: '100%', objectPosition: 'top',
                filter: player1Hp <= 0 ? 'grayscale(1) brightness(0.4)' : 'drop-shadow(0 0 20px ' + player1.color + '66)',
                border: `2px solid ${player1.color}66`,
              }} />
            {p1Submitted && phase === 'select-action' && (
              <div className="absolute bottom-2 left-0 right-0 text-center text-green-400 text-xs font-bold bg-black/80 py-1">
                ✓ Готов
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 text-4xl">
            <div style={{ textShadow: '0 0 30px #ff0000', color: '#ff2020', fontFamily: 'Impact, sans-serif' }}>VS</div>
          </div>

          <div className="relative flex flex-col items-center" style={{ width: '35%' }}>
            <img src={player2.image} alt={player2.name}
              className="object-cover object-top rounded-sm"
              style={{
                height: 200, width: '100%', objectPosition: 'top',
                transform: 'scaleX(-1)',
                filter: player2Hp <= 0 ? 'grayscale(1) brightness(0.4)' : 'drop-shadow(0 0 20px ' + player2.color + '66)',
                border: `2px solid ${player2.color}66`,
              }} />
            {p2Submitted && phase === 'select-action' && !isVsAI && (
              <div className="absolute bottom-2 left-0 right-0 text-center text-green-400 text-xs font-bold bg-black/80 py-1">
                ✓ Готов
              </div>
            )}
            {isVsAI && (
              <div className="absolute bottom-2 left-0 right-0 text-center text-purple-400 text-xs font-bold bg-black/80 py-1">
                🤖 ИИ
              </div>
            )}
          </div>
        </div>

        {/* Action Panels */}
        {phase === 'select-action' && (
          <div className={`grid ${isVsAI ? 'grid-cols-1' : 'grid-cols-2'} gap-4 px-4 pb-6`}>
            <ActionPanel
              onSubmit={handleP1Action}
              specials={player1Specials}
              playerName={player1.name}
              playerColor={player1.color}
              disabled={p1Submitted}
              label={isVsAI ? player1.name : `${player1.name} (Игрок 1)`}
            />
            {!isVsAI && (
              <ActionPanel
                onSubmit={handleP2Action}
                specials={player2Specials}
                playerName={player2.name}
                playerColor={player2.color}
                disabled={p2Submitted}
                label={`${player2.name} (Игрок 2)`}
              />
            )}
          </div>
        )}

        {/* Game Over */}
        {phase === 'gameover' && (
          <div className="flex flex-col items-center justify-center pb-8 gap-6 px-4">
            <div className="text-center">
              <div className="text-5xl font-black uppercase tracking-widest"
                style={{
                  color: winner === 'player1' ? player1.color : player2.color,
                  fontFamily: 'Impact, sans-serif',
                  textShadow: `0 0 40px ${winner === 'player1' ? player1.color : player2.color}`,
                }}>
                {winner === 'player1' ? player1.name : player2.name}
              </div>
              <div className="text-2xl font-bold text-white mt-2 uppercase tracking-widest">ПОБЕДИЛ</div>
              <div className="text-gray-400 text-sm mt-2">{currentRound - 1} раундов</div>
            </div>
            <button onClick={onBack}
              className="px-10 py-3 text-xl font-black uppercase tracking-widest text-white transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #7f0000, #cc0000)',
                border: '2px solid #ff2020',
                boxShadow: '0 0 20px #ff000066',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              }}>
              ← В МЕНЮ
            </button>
          </div>
        )}
      </div>

      {showResult && lastResult && phase === 'reveal' && (
        <RoundResult result={lastResult} player1={player1} player2={player2} onContinue={handleContinue} />
      )}
    </div>
  );
}
