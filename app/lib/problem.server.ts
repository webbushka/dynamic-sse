import { prisma } from './db.server'
import { generateExpression } from './game-logic'

export async function getTodaysProblem() {
	const now = new Date()
	const today = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
	)

	let problem = await prisma.problem.findUnique({
		where: { date: today },
	})

	if (!problem) {
		// Generate a new problem for today with 6-character equations
		try {
			const puzzle = generateExpression()

			problem = await prisma.problem.create({
				data: {
					answer: puzzle.answer,
					expression: puzzle.expression,
					date: today,
				},
			})
		} catch (error) {
			console.error('Error generating problem:', error)
			throw new Error('Failed to generate a valid problem for today')
		}
	}

	return problem
}

export async function getAllProblems() {
	return await prisma.problem.findMany({
		orderBy: { date: 'desc' },
		take: 30, // Last 30 days
	})
}
