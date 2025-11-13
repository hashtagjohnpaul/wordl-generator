import React from 'react';
import type { LetterStatus } from '../types';
import { MAX_GUESSES } from '../constants';
import { getGuessStatuses } from '../utils';

interface GridProps {
  guesses: string[];
  currentGuess: string;
  turn: number;
  solution: string;
  wordLength: number;
}

const Tile: React.FC<{ letter?: string; status: LetterStatus; isRevealed?: boolean }> = ({ letter, status, isRevealed }) => {
  const statusClasses = {
    idle: 'border-gray-500',
    correct: 'bg-green-600 border-green-600 text-white',
    present: 'bg-yellow-500 border-yellow-500 text-white',
    absent: 'bg-gray-700 border-gray-700 text-white',
  };

  const animationClass = isRevealed ? 'animate-[flip_0.5s_ease-out_forwards]' : '';

  return (
    <div 
        className={`w-14 h-14 md:w-16 md:h-16 border-2 ${statusClasses[status]} inline-flex items-center justify-center text-3xl font-bold uppercase transition-colors duration-300 ${animationClass}`}
        style={{ backfaceVisibility: 'hidden' }}
    >
      {letter}
    </div>
  );
};


const Row: React.FC<{ guess: string; solution: string; wordLength: number; isCompleted?: boolean; isCurrent?: boolean; currentGuess?: string }> = ({ guess, solution, wordLength, isCompleted, isCurrent, currentGuess }) => {
  if (isCurrent) {
    const letters = currentGuess ? currentGuess.split('') : [];
    return (
      <div className="flex gap-1.5">
        {Array.from({ length: wordLength }).map((_, i) => (
          <Tile key={i} letter={letters[i]} status="idle" />
        ))}
      </div>
    );
  }

  if (isCompleted) {
    const statuses = getGuessStatuses(guess, solution);
    return (
        <div className="flex gap-1.5">
        {guess.split('').map((letter, i) => (
             <Tile key={i} letter={letter} status={statuses[i]} isRevealed={true} />
        ))}
        </div>
    );
  }

  return (
    <div className="flex gap-1.5">
      {Array.from({ length: wordLength }).map((_, i) => (
        <Tile key={i} status="idle" />
      ))}
    </div>
  );
};


const Grid: React.FC<GridProps> = ({ guesses, currentGuess, turn, solution, wordLength }) => {
  return (
    <div className="grid gap-1.5 mb-6">
      {Array.from({ length: MAX_GUESSES }).map((_, i) => (
        <Row
          key={i}
          guess={guesses[i]}
          solution={solution}
          wordLength={wordLength}
          isCompleted={i < turn}
          isCurrent={i === turn}
          currentGuess={currentGuess}
        />
      ))}
    </div>
  );
};

export default Grid;
