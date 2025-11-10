
import React from 'react';
import { KEYBOARD_KEYS } from '../constants';
import type { LetterStatuses } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStatuses: LetterStatuses;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, letterStatuses }) => {
  return (
    <div className="w-full max-w-lg mx-auto">
      {KEYBOARD_KEYS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5 my-1.5">
          {row.map(key => {
            const status = letterStatuses[key];
            const keyClasses = {
              correct: 'bg-green-600 text-white',
              present: 'bg-yellow-500 text-white',
              absent: 'bg-gray-700 text-white',
              idle: 'bg-gray-500 hover:bg-gray-600',
            };

            const isSpecialKey = key === 'Enter' || key === 'Backspace';
            const widthClass = isSpecialKey ? 'w-16' : 'w-10';

            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`h-14 ${widthClass} rounded-md font-bold uppercase flex items-center justify-center transition-colors text-sm md:text-base ${status ? keyClasses[status] : keyClasses.idle}`}
              >
                {key === 'Backspace' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 12M3 12l6.414-6.414a2 2 0 012.828 0L21 12" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
