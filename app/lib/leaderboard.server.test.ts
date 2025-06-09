import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prisma } from './db.server'
import {
	submitScore,
	getGlobalLeaderboard,
	getUserStats,
	getTodaysLeaderboard,
} from './leaderboard.server'

// Mock Prisma methods
vi.mock('./db.server', () => ({
	prisma: {
		leaderboardEntry: {
			upsert: vi.fn(),
			findUnique: vi.fn(),
			findMany: vi.fn(),
		},
	},
}))

beforeEach(() => {
	vi.clearAllMocks()
})

describe('submitScore', () => {
	it('creates a new score if no existing entry', async () => {
		;(prisma.leaderboardEntry.findUnique as any).mockResolvedValue(null)
		;(prisma.leaderboardEntry.upsert as any).mockResolvedValue({ score: 123 })

		const result = await submitScore('1234', 'user1', 'prob1', 2, 5000)

		expect(prisma.leaderboardEntry.upsert).toHaveBeenCalledWith(
			expect.objectContaining({
				create: expect.objectContaining({
					userId: '1234',
					userName: 'user1',
					problemId: 'prob1',
					score: 2 * 100 + 5,
				}),
			}),
		)

		expect(result).toEqual({ score: 123 })
	})

	it('updates score only if new one is better', async () => {
		;(prisma.leaderboardEntry.findUnique as any).mockResolvedValue({
			score: 300,
		})
		;(prisma.leaderboardEntry.upsert as any).mockResolvedValue({ score: 205 })

		const result = await submitScore('1234', 'user1', 'prob1', 2, 5000)

		expect(prisma.leaderboardEntry.upsert).toHaveBeenCalledWith(
			expect.objectContaining({
				update: expect.objectContaining({
					score: 205,
				}),
			}),
		)

		expect(result.score).toBe(205)
	})
})

describe('getGlobalLeaderboard', () => {
	it('groups entries by user and calculates average and best score', async () => {
		;(prisma.leaderboardEntry.findMany as any).mockResolvedValue([
			{ userId: 'u1', score: 120, problem: {} },
			{ userId: 'u1', score: 100, problem: {} },
			{ userId: 'u2', score: 90, problem: {} },
		])

		const result = await getGlobalLeaderboard(10)

		expect(result).toEqual([
			{
				userId: 'u2',
				totalScore: 90,
				gamesPlayed: 1,
				bestScore: 90,
				averageScore: 90,
			},
			{
				userId: 'u1',
				totalScore: 220,
				gamesPlayed: 2,
				bestScore: 100,
				averageScore: 110,
			},
		])
	})
})

describe('getUserStats', () => {
	it('returns null if user has no entries', async () => {
		;(prisma.leaderboardEntry.findMany as any).mockResolvedValue([])

		const result = await getUserStats('user123')
		expect(result).toBeNull()
	})

	it('returns aggregated stats for user', async () => {
		;(prisma.leaderboardEntry.findMany as any).mockResolvedValue([
			{ score: 120, attempts: 3, problem: {} },
			{ score: 100, attempts: 2, problem: {} },
			{ score: 140, attempts: 4, problem: {} },
		])

		const result = await getUserStats('user123')

		expect(result).toMatchObject({
			gamesPlayed: 3,
			bestScore: 100,
			averageScore: 120,
			averageAttempts: 3,
		})

		expect(result?.recentGames.length).toBe(3)
	})
})

describe('getTodaysLeaderboard', () => {
	it('fetches leaderboard entries ordered by score', async () => {
		;(prisma.leaderboardEntry.findMany as any).mockResolvedValue([
			{ userId: 'u1', score: 100 },
			{ userId: 'u2', score: 110 },
		])

		const result = await getTodaysLeaderboard('prob1')

		expect(prisma.leaderboardEntry.findMany).toHaveBeenCalledWith({
			where: { problemId: 'prob1' },
			orderBy: { score: 'asc' },
			take: 10,
		})

		expect(result).toHaveLength(2)
		if (!result[0] || !result[1]) {
			throw new Error('Expected two leaderboard entries')
		}
		expect(result[0].score).toBeLessThanOrEqual(result[1].score)
	})
})
