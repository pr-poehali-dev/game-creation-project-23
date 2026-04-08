import { useState, useCallback } from 'react';
import { GameScreen, Character, BattleRecord, PlayerAction } from '@/types/game';
import { useGameLogic } from '@/hooks/useGameLogic';
import MainMenu from '@/components/game/MainMenu';
import CharacterSelect from '@/components/game/CharacterSelect';
import Arena from '@/components/game/Arena';
import HistoryPage from '@/components/game/HistoryPage';
import StatsPage from '@/components/game/StatsPage';
import SettingsPage, { Settings } from '@/components/game/SettingsPage';

const defaultSettings: Settings = {
  playerName: 'Игрок 1',
  soundEnabled: false,
  animationsEnabled: true,
  aiDifficulty: 'normal',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage error', e);
  }
}

export default function Index() {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [records, setRecords] = useState<BattleRecord[]>(() => loadFromStorage('brutal_arena_records', []));
  const [settings, setSettings] = useState<Settings>(() => loadFromStorage('brutal_arena_settings', defaultSettings));

  const { gameState, startGame, submitAction, submitPlayer2Action, confirmReveal, resetGame } = useGameLogic();

  const handleStartGame = useCallback((p1: Character, p2: Character, vsAI: boolean) => {
    startGame(p1, p2, vsAI);
    setScreen('arena');
  }, [startGame]);

  const handleSaveRecord = useCallback((record: BattleRecord) => {
    setRecords(prev => {
      const updated = [...prev, record];
      saveToStorage('brutal_arena_records', updated);
      return updated;
    });
  }, []);

  const handleSaveSettings = useCallback((s: Settings) => {
    setSettings(s);
    saveToStorage('brutal_arena_settings', s);
  }, []);

  const handleClearHistory = useCallback(() => {
    setRecords([]);
    saveToStorage('brutal_arena_records', []);
  }, []);

  const handleBack = useCallback(() => {
    resetGame();
    setScreen('menu');
  }, [resetGame]);

  const handleP2Action = useCallback((action: PlayerAction) => {
    if (!gameState) return;
    submitPlayer2Action(action);
    if (gameState.player1Action) {
      submitAction(gameState.player1Action);
    }
  }, [gameState, submitPlayer2Action, submitAction]);

  if (screen === 'menu') return <MainMenu onNavigate={setScreen} />;
  if (screen === 'character-select') return <CharacterSelect onStartGame={handleStartGame} onBack={() => setScreen('menu')} />;
  if (screen === 'history') return <HistoryPage records={records} onBack={() => setScreen('menu')} onClear={handleClearHistory} />;
  if (screen === 'stats') return <StatsPage records={records} onBack={() => setScreen('menu')} playerName={settings.playerName} />;
  if (screen === 'settings') return <SettingsPage settings={settings} onSave={handleSaveSettings} onBack={() => setScreen('menu')} />;

  if (screen === 'arena' && gameState) {
    return (
      <Arena
        gameState={gameState}
        onSubmitAction={submitAction}
        onSubmitP2Action={handleP2Action}
        onConfirmReveal={confirmReveal}
        onBack={handleBack}
        onSaveRecord={handleSaveRecord}
      />
    );
  }

  return <MainMenu onNavigate={setScreen} />;
}