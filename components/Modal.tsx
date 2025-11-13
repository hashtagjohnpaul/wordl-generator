import React, { useState } from 'react';
import type { GameState } from '../types';
import { getGuessStatuses } from '../utils';
import { MAX_GUESSES } from '../constants';


interface ModalProps {
  gameState: GameState;
  secretPhrase: string;
  solution: string;
  history: { guesses: string[]; solution: string }[];
}

const Modal: React.FC<ModalProps> = ({ gameState, secretPhrase, solution, history }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  if (gameState !== 'won' && gameState !== 'lost') return null;

  const handleCreateNew = () => {
    window.location.hash = '';
  };
  
  const handleTryAgain = () => {
    window.location.reload();
  }

  const handleShare = () => {
    const emojiMap = {
      correct: '🟩',
      present: '🟨',
      absent: '⬛',
    };
    
    let shareText = `My Wordl Puzzle!\n\n`;
    
    history.forEach((wordResult, index) => {
        const guessCount = wordResult.guesses.length;
        const result = wordResult.guesses[guessCount - 1] === wordResult.solution ? guessCount : 'X';
        shareText += `Word ${index + 1} (${result}/${MAX_GUESSES})\n`;
        wordResult.guesses.forEach(guess => {
            const statuses = getGuessStatuses(guess, wordResult.solution);
            shareText += statuses.map(s => emojiMap[s]).join('') + '\n';
        });
        shareText += '\n';
    });

    if (gameState === 'won') {
        shareText += "I solved it! ✨";
    } else {
        shareText += "I couldn't solve it. 😔";
    }

    navigator.clipboard.writeText(shareText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

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
            <button
              onClick={handleShare}
              className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-bold transition"
            >
              {isCopied ? 'Copied!' : 'Share Results'}
            </button>
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
