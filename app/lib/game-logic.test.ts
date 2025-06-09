import { describe, it, expect } from 'vitest'
import {
	evaluateEquation,
	isValidEquation,
	generateExpression,
	getFeedback,
	createGameState,
} from './game-logic'

describe('evaluateEquation', () => {
	it('evaluates valid equations correctly', () => {
		expect(evaluateEquation('3+2*55')).toBe(113)
		expect(evaluateEquation('12/4+12')).toBe(15)
	})

	it('returns null for invalid equations', () => {
		expect(evaluateEquation('3++2')).toBeNull()
		expect(evaluateEquation('3/0')).toBe(Infinity)
		expect(evaluateEquation('bad input')).toBeNull()
	})
})

describe('isValidEquation', () => {
	it('rejects expressions not 6 characters long', () => {
		expect(isValidEquation('12+3')).toBe(false)
		expect(isValidEquation('1234567')).toBe(false)
	})

	it('rejects invalid characters', () => {
		expect(isValidEquation('12+3a6')).toBe(false)
	})

	it('rejects starting/ending with an operator', () => {
		expect(isValidEquation('+12345')).toBe(false)
		expect(isValidEquation('12345+')).toBe(false)
	})

	it('rejects consecutive operators', () => {
		expect(isValidEquation('12++34')).toBe(false)
	})

	it('rejects division by zero', () => {
		expect(isValidEquation('12/034')).toBe(false)
		expect(isValidEquation('12/0+3')).toBe(false)
	})

	it('accepts valid equations if format is right', () => {
		expect(isValidEquation('12+3*2')).toBe(true)
	})

	it('checks target value if provided', () => {
		expect(isValidEquation('12/4+2', 5)).toBe(true)
		expect(isValidEquation('12/4+2', 6)).toBe(false)
	})
})

describe('generateExpression', () => {
	it('returns a valid expression and correct answer', () => {
		const { expression, answer } = generateExpression()
		expect(expression).toHaveLength(6)
		expect(/^[0-9+\-*/]+$/.test(expression)).toBe(true)
		expect(isValidEquation(expression)).toBe(true)
		expect(evaluateEquation(expression)).toBe(answer)
	})
})

describe('getFeedback', () => {
	it('marks correct characters with "correct"', () => {
		const feedback = getFeedback('12+3*4', '12+3*4')
		feedback.forEach((f) => expect(f.status).toBe('correct'))
	})

	it('marks characters in wrong position correctly', () => {
		const feedback = getFeedback('12+3*4', '21+3*4')
		expect(feedback[0]?.status).toBe('wrong-position')
		expect(feedback[1]?.status).toBe('wrong-position')
		expect(feedback.slice(2).every((f) => f.status === 'correct')).toBe(true)
	})

	it('marks characters not used', () => {
		const feedback = getFeedback('999999', '123456')
		feedback.forEach((f) => expect(f.status).toBe('not-used'))
	})

	it('handles mixed correct, wrong-position, and not-used', () => {
		const feedback = getFeedback('13+2+3', '33+1+2')
		expect(feedback[0]?.status).toBe('wrong-position')
		expect(feedback[1]?.status).toBe('correct')
		expect(feedback[2]?.status).toBe('correct')
		expect(feedback[3]?.status).toBe('wrong-position')
		expect(feedback[4]?.status).toBe('correct')
		expect(feedback[5]?.status).toBe('wrong-position')
		expect(feedback).toHaveLength(6)
	})
})

describe('createGameState', () => {
	it('creates a valid GameState object', () => {
		const state = createGameState('abc123', 42, '12+3*4')
		expect(state).toMatchObject({
			problemId: 'abc123',
			target: 42,
			equation: '12+3*4',
			guesses: [],
			currentGuess: '',
			gameStatus: 'playing',
			attempts: 0,
			maxAttempts: 6,
		})
		expect(typeof state.startTime).toBe('number')
	})
})
