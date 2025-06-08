export interface GameState {
	problemId: string
	target: number
	equation: string
	guesses: string[]
	currentGuess: string
	gameStatus: 'playing' | 'won' | 'lost'
	attempts: number
	maxAttempts: number
	startTime: number
}

export interface CellFeedback {
	char: string
	status: 'correct' | 'wrong-position' | 'not-used' | 'empty'
}

export function evaluateEquation(equation: string): number | null {
	try {
		// Basic validation - only allow numbers, operators, and basic math
		if (!/^[0-9+\-*/\s]+$/.test(equation)) {
			return null
		}

		// Evaluate the expression safely
		const result = Function(`"use strict"; return (${equation})`)()
		return typeof result === 'number' && !isNaN(result)
			? Math.round(result * 100) / 100
			: null
	} catch {
		return null
	}
}

export function isValidEquation(guess: string, target?: number): boolean {
	// Must be exactly 6 characters for the equation part
	if (guess.length !== 6) return false

	// Must only contain valid characters
	if (!/^[0-9+\-*/]+$/.test(guess)) return false

	// Must not start or end with an operator
	if (/^[+\-*/]|[+\-*/]$/.test(guess)) return false

	// prevent division by zero
	if (/[/]0/.test(guess)) return false

	// Must not have consecutive operators
	if (/[+\-*/]{2,}/.test(guess)) return false

	if (target) {
		// Evaluate the equation
		const calculatedResult = evaluateEquation(guess)
		return calculatedResult === target
	} else {
		// If no target is provided, just validate the format
		return true
	}
}

export function generateExpression() {
	const operators = ['+', '-', '*', '/']
	const maxAttempts = 1000

	for (let i = 0; i < maxAttempts; i++) {
		let expr = ''
		for (let j = 0; j < 6; j++) {
			expr +=
				j % 2 === 0 || j === 5 // even index or last character
					? Math.floor(Math.random() * 10).toString() // digit
					: operators[Math.floor(Math.random() * operators.length)] // operator
		}

		if (isValidEquation(expr)) {
			const answer = evaluateEquation(expr)

			if (answer !== null) {
				return {
					expression: expr,
					answer: Math.round((answer + Number.EPSILON) * 1000) / 1000,
				}
			}
		}
	}

	throw new Error('Failed to generate a valid expression after many attempts')
}

export function getFeedback(guess: string, target: string): CellFeedback[] {
	const feedback: CellFeedback[] = []
	const targetChars = target.split('')
	const guessChars = guess.split('')

	// First pass: mark correct positions
	const usedTargetIndices = new Set<number>()
	const usedGuessIndices = new Set<number>()

	for (let i = 0; i < guessChars.length; i++) {
		if (guessChars[i] === targetChars[i]) {
			feedback[i] = { char: guessChars[i], status: 'correct' }
			usedTargetIndices.add(i)
			usedGuessIndices.add(i)
		}
	}

	// Second pass: mark wrong positions
	for (let i = 0; i < guessChars.length; i++) {
		if (usedGuessIndices.has(i)) continue

		let found = false
		for (let j = 0; j < targetChars.length; j++) {
			if (!usedTargetIndices.has(j) && guessChars[i] === targetChars[j]) {
				feedback[i] = { char: guessChars[i], status: 'wrong-position' }
				usedTargetIndices.add(j)
				found = true
				break
			}
		}

		if (!found) {
			feedback[i] = { char: guessChars[i], status: 'not-used' }
		}
	}

	return feedback
}

export function createGameState(
	problemId: string,
	target: number,
	equation: string,
): GameState {
	return {
		problemId,
		target,
		equation,
		guesses: [],
		currentGuess: '',
		gameStatus: 'playing',
		attempts: 0,
		maxAttempts: 6,
		startTime: Date.now(),
	}
}
