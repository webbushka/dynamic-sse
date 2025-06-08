import { prisma } from './db.server'

export async function submitScore(
	userId: string,
	userName: string,
	problemId: string,
	attempts: number,
	durationMs: number,
) {
	// Calculate score (lower is better - based on attempts and time)
	const score = attempts * 100 + Math.floor(durationMs / 1000)

	try {
		const entry = await prisma.leaderboardEntry.upsert({
			where: {
				userId_problemId: {
					userId,
					problemId,
				},
			},
			update: {
				score: Math.min(
					score,
					(await getExistingScore(userId, userName, problemId)) || score,
				),
				attempts,
				durationMs,
			},
			create: {
				userId,
				userName,
				problemId,
				score,
				attempts,
				durationMs,
			},
		})

		return entry
	} catch (error) {
		console.error('Error submitting score:', error)
		throw error
	}
}

async function getExistingScore(
	userId: string,
	userName: string,
	problemId: string,
): Promise<number | null> {
	const existing = await prisma.leaderboardEntry.findUnique({
		where: {
			userId_problemId: {
				userId,
				problemId,
			},
		},
	})
	return existing?.score || null
}

export async function getGlobalLeaderboard(limit = 10) {
	const entries = await prisma.leaderboardEntry.findMany({
		include: {
			problem: true,
		},
		orderBy: {
			score: 'asc', // Lower score is better
		},
		take: limit,
	})

	// Group by user and calculate average score
	type UserStats = {
		userId: string
		userName: string
		totalScore: number
		gamesPlayed: number
		bestScore: number
	}
	const userStats = new Map<string, UserStats>()

	entries.forEach((entry) => {
		if (!userStats.has(entry.userId)) {
			userStats.set(entry.userId, {
				userId: entry.userId,
				userName: entry.userName,
				totalScore: 0,
				gamesPlayed: 0,
				bestScore: entry.score,
			})
		}

		const stats = userStats.get(entry.userId)!
		stats.totalScore += entry.score
		stats.gamesPlayed += 1
		stats.bestScore = Math.min(stats.bestScore, entry.score)
		stats.userName = entry.userName
	})

	return Array.from(userStats.values())
		.map((stats) => ({
			...stats,
			averageScore:
				Math.round((stats.totalScore / stats.gamesPlayed) * 10) / 10,
		}))
		.sort((a, b) => a.averageScore - b.averageScore)
		.slice(0, limit)
}

export async function getUserStats(userId: string) {
	const entries = await prisma.leaderboardEntry.findMany({
		where: { userId },
		include: { problem: true },
		orderBy: { createdAt: 'desc' },
	})

	if (entries.length === 0) {
		return null
	}

	const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0)
	const averageScore = totalScore / entries.length
	const bestScore = Math.min(...entries.map((e) => e.score))
	const averageAttempts =
		entries.reduce((sum, entry) => sum + entry.attempts, 0) / entries.length

	return {
		gamesPlayed: entries.length,
		averageScore: Math.round(averageScore * 10) / 10,
		bestScore,
		averageAttempts: Math.round(averageAttempts * 10) / 10,
		recentGames: entries.slice(0, 5),
	}
}

export async function getTodaysLeaderboard(problemId: string, limit = 10) {
	return await prisma.leaderboardEntry.findMany({
		where: { problemId },
		orderBy: { score: 'asc' },
		take: limit,
	})
}
