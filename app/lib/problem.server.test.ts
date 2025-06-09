import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prisma } from './db.server'
import { generateExpression } from './game-logic'
import { getTodaysProblem, getAllProblems } from './problem.server'

vi.mock('./db.server', () => ({
	prisma: {
		problem: {
			findUnique: vi.fn(),
			create: vi.fn(),
			findMany: vi.fn(),
		},
	},
}))

vi.mock('./game-logic', () => ({
	generateExpression: vi.fn(),
}))

beforeEach(() => {
	vi.clearAllMocks()
})

describe('getTodaysProblem', () => {
	it('returns existing problem if found', async () => {
		const fakeDate = new Date()
		const fakeProblem = {
			id: '1',
			date: fakeDate,
			expression: '12+34',
			answer: 46,
		}

		;(prisma.problem.findUnique as any).mockResolvedValue(fakeProblem)

		const result = await getTodaysProblem()

		expect(prisma.problem.findUnique).toHaveBeenCalledWith({
			where: {
				date: new Date(
					Date.UTC(
						fakeDate.getUTCFullYear(),
						fakeDate.getUTCMonth(),
						fakeDate.getUTCDate(),
					),
				),
			},
		})

		expect(result).toEqual(fakeProblem)
	})

	it('creates and returns new problem if not found', async () => {
		;(prisma.problem.findUnique as any).mockResolvedValue(null)

		const generated = { expression: '12+34', answer: 46 }
		;(generateExpression as any).mockReturnValue(generated)

		const createdProblem = {
			id: '2',
			expression: '12+34',
			answer: 46,
			date: new Date(Date.UTC(2025, 5, 6)),
		}

		;(prisma.problem.create as any).mockResolvedValue(createdProblem)

		const result = await getTodaysProblem()

		expect(generateExpression).toHaveBeenCalled()
		expect(prisma.problem.create).toHaveBeenCalledWith({
			data: {
				answer: 46,
				expression: '12+34',
				date: expect.any(Date),
			},
		})

		expect(result).toEqual(createdProblem)
	})

	it('throws if generateExpression fails', async () => {
		;(prisma.problem.findUnique as any).mockResolvedValue(null)
		;(generateExpression as any).mockImplementation(() => {
			throw new Error('generation failed')
		})

		await expect(getTodaysProblem()).rejects.toThrow(
			'Failed to generate a valid problem for today',
		)
	})
})

describe('getAllProblems', () => {
	it('returns last 30 problems ordered by date descending', async () => {
		const problems = [
			{ id: '3', date: new Date(), expression: '1+2+3', answer: 6 },
			{ id: '2', date: new Date(), expression: '4*5-1', answer: 19 },
		]

		;(prisma.problem.findMany as any).mockResolvedValue(problems)

		const result = await getAllProblems()

		expect(prisma.problem.findMany).toHaveBeenCalledWith({
			orderBy: { date: 'desc' },
			take: 30,
		})

		expect(result).toEqual(problems)
	})
})
