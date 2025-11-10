
import React, { useState, useEffect, useCallback } from 'react';
import CreatorView from './components/CreatorView';
import PlayerView from './components/PlayerView';
import type { GameData } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'creator' | 'player'>('creator');
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/play/')) {
        try {
          const encodedData = hash.substring(7);
          const decodedJson = atob(encodedData);
          const parsedData = JSON.parse(decodedJson) as GameData;

          if (
            parsedData &&
            Array.isArray(parsedData.words) &&
            parsedData.words.length > 0 &&
            typeof parsedData.phrase === 'string'
          ) {
            setGameData(parsedData);
            setView('player');
            setError(null);
          } else {
            throw new Error('Invalid game data structure.');
          }
        } catch (err) {
          console.error('Failed to parse game data from hash:', err);
          setError('The game link is corrupted or invalid. Please create a new game.');
          window.location.hash = '';
          setView('creator');
          setGameData(null);
        }
      } else {
        setView('creator');
        setGameData(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check on load

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  const handleGameCreated = useCallback((data: GameData) => {
    const encodedData = btoa(JSON.stringify(data));
    window.location.hash = `#/play/${encodedData}`;
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 font-sans">
       <header className="text-center mb-8 mt-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Wordl Puzzle Generator
        </h1>
        <p className="text-gray-400 mt-2">Create, share, and solve custom word puzzles.</p>
      </header>

      <main className="w-full max-w-2xl">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        {view === 'creator' && !gameData ? (
          <CreatorView onGameCreated={handleGameCreated} />
        ) : view === 'player' && gameData ? (
          <PlayerView gameData={gameData} />
        ) : null}
      </main>
    </div>
  );
};

export default App;
