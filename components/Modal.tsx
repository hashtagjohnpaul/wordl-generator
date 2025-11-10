
import React from 'react';
import type { GameState } from '../types';

interface ModalProps {
  gameState: GameState;
  secretPhrase: string;
  solution: string;
}

const Modal: React.FC<ModalProps> = ({ gameState, secretPhrase, solution }) => {
  if (gameState !== 'won' && gameState !== 'lost') return null;

  const handleCreateNew = () => {
    window.location.hash = '';
  };
  
  const handleTryAgain = () => {
    window.location.reload();
  }

  const isWin = gameState === 'won';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 text-center max-w-sm w-full border-2 border-gray-700 animate-[zoomIn_0.3s_ease-out]">
        <h2 className={`text-3xl font-bold mb-4 ${isWin ? 'text-green-400' : 'text-red-400'}`}>
          {isWin ? 'Congratulations!' : 'Game Over'}
        </h2>
        
        {isWin ? (
          <div>
            <p className="text-gray-300 mb-2">You've solved all the puzzles!</p>
            <p className="text-gray-300 mb-4">Here is your secret phrase:</p>
            <div className="bg-gray-900 p-4 rounded-md border border-purple-500">
              <p className="text-xl font-semibold text-purple-300">{secretPhrase}</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 mb-2">So close! The word was:</p>
            <p className="text-2xl font-bold tracking-widest uppercase text-yellow-400 mb-6">{solution}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col space-y-3">
          {!isWin && (
              <button 
                onClick={handleTryAgain}
                className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white font-bold transition">
                Try Again
              </button>
          )}
          <button
            onClick={handleCreateNew}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-bold transition"
          >
            Create New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
