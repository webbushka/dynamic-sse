import { data, type ActionFunctionArgs, useLoaderData } from 'react-router'
import { GameBoard } from '#app/components/game/game-board'
import { GuessForm } from '#app/components/game/game-form'
import { GameHeader } from '#app/components/game/game-header'
import { GameInstructions } from '#app/components/game/game-instructions'
import { GameOver } from '#app/components/game/game-over'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { useGameState } from '#app/hooks/use-game-state'
import { isValidEquation, getFeedback } from '#app/lib/game-logic'
import { submitScore } from '#app/lib/leaderboard.server'
import { getTodaysProblem } from '#app/lib/problem.server'
import { cn } from '#app/lib/utils'

export async function loader() {
	const problem = await getTodaysProblem()
	return data({
		problemDate: problem.date,
		problemId: problem.id,
		target: problem.answer,
	})
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const guess = formData.get('guess') as string
	const problemId = formData.get('problemId') as string
	const target = Number(formData.get('target'))
	const attempts = Number(formData.get('attempts'))
	const startTime = Number(formData.get('startTime'))
	const guessesJson = formData.get('guesses') as string
	const userId = formData.get('userId') as string
	const userName = formData.get('userName') as string

	// Get the actual problem to check against
	const problem = await getTodaysProblem()
	let durationMs

	if (!guess || guess.length !== 6) {
		return data(
			{
				error: 'Equation must be exactly 6 characters long!',
				success: false,
			},
			{ status: 400 },
		)
	}

	if (!isValidEquation(guess, target)) {
		return data(
			{
				error:
					'Invalid equation! Make sure it equals the target number and uses valid math operations.',
				success: false,
			},
			{ status: 400 },
		)
	}

	const previousGuesses = guessesJson
		? (JSON.parse(guessesJson) as string[])
		: []
	const newGuesses = [...previousGuesses, guess]
	const newAttempts = attempts + 1

	// Check if the guess is correct
	const isCorrect = guess === problem.expression
	const isGameOver = isCorrect || newAttempts >= 6

	let gameStatus: 'playing' | 'won' | 'lost' = 'playing'
	if (isCorrect) {
		gameStatus = 'won'

		// Submit score if user is authenticated and game is won
		if (userId && userId !== 'anonymous') {
			durationMs = Date.now() - startTime
			try {
				await submitScore(userId, userName, problemId, newAttempts, durationMs)
			} catch (error) {
				console.error('Error submitting score:', error)
			}
		}
	} else if (newAttempts >= 6) {
		gameStatus = 'lost'
	}

	// Generate feedback for the guess
	const feedback = getFeedback(guess, problem.expression)

	return data({
		success: true,
		feedback,
		gameStatus,
		attempts: newAttempts,
		guesses: newGuesses,
		durationMs,
		correctAnswer: isGameOver ? problem.expression : null,
		error: null,
	})
}

export default function Game() {
	const { problemId, problemDate, target } = useLoaderData<typeof loader>()
	const {
		gameState,
		currentInput,
		setCurrentInput,
		handleRestart,
		actionData,
	} = useGameState(problemId, problemDate)

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<GameHeader target={target} onRestart={handleRestart} />

				{/* Game Board */}
				<div className="mx-auto max-w-md">
					<Card>
						<CardHeader>
							<CardTitle className="text-center">Target: {target}</CardTitle>
							<p
								className={cn('text-center text-sm text-gray-600', {
									hidden: gameState.gameStatus !== 'playing',
								})}
							>
								Attempt {gameState.attempts + 1} of 6
							</p>
						</CardHeader>
						<CardContent className="space-y-2">
							<GameBoard
								gameState={gameState}
								target={target}
								currentInput={currentInput}
								setCurrentInput={setCurrentInput}
							/>
						</CardContent>

						{/* Submit Form */}
						{gameState.gameStatus === 'playing' && (
							<GuessForm
								gameState={gameState}
								currentInput={currentInput}
								problemId={problemId}
								target={target}
								error={actionData?.error || null}
							/>
						)}
					</Card>

					{/* Game Over */}
					{gameState.gameStatus !== 'playing' && actionData?.error === null && (
						<GameOver
							gameState={gameState}
							correctAnswer={actionData?.correctAnswer || null}
							durationMs={actionData?.durationMs}
							onRestart={handleRestart}
						/>
					)}

					{/* Instructions */}
					<GameInstructions target={target} />
				</div>
			</div>
		</div>
	)
}
