import type { LetterStatus } from './types';

export const getGuessStatuses = (guess: string, solution: string): LetterStatus[] => {
    const splitSolution = solution.split('');
    const splitGuess = guess.split('');

    const statuses: LetterStatus[] = Array(solution.length).fill('absent');
    const solutionCharsTaken = Array(solution.length).fill(false);

    // First pass for correct letters
    splitGuess.forEach((letter, i) => {
        if (splitSolution[i] === letter) {
            statuses[i] = 'correct';
            solutionCharsTaken[i] = true;
        }
    });

    // Second pass for present letters
    splitGuess.forEach((letter, i) => {
        if (statuses[i] === 'correct') {
            return;
        }

        const indexOfPresentChar = splitSolution.findIndex(
            (solutionChar, index) => {
                return (
                    !solutionCharsTaken[index] &&
                    solutionChar === letter
                );
            }
        );

        if (indexOfPresentChar > -1) {
            statuses[i] = 'present';
            solutionCharsTaken[indexOfPresentChar] = true;
        }
    });

    return statuses;
}
