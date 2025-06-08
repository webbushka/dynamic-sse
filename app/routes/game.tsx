import {
	data,
	type LoaderFunctionArgs,
	type ActionFunctionArgs,
	useLoaderData,
	Link,
	useFetcher,
	Form,
	useActionData,
} from 'react-router'
import { useState, useEffect, use } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { ArrowLeft, Calculator, Info, RotateCcw, Trophy } from 'lucide-react'
import { getTodaysProblem } from '~/lib/problem.server'
import { isValidEquation, getFeedback } from '~/lib/game-logic'
import { submitScore } from '~/lib/leaderboard.server'
import { cn } from '~/lib/utils'
import {
	useDynamicContext,
	useUserUpdateRequest,
} from '@dynamic-labs/sdk-react-core'
import useUserGameResults from '~/hooks/use-user-game-results'

export async function loader({ request }: LoaderFunctionArgs) {
	const problem = await getTodaysProblem()
	return data({
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

	const previousGuesses = guessesJson ? JSON.parse(guessesJson) : []
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

interface GameState {
	guesses: string[]
	feedbacks: Array<Array<{ char: string; status: string }>>
	attempts: number
	gameStatus: 'playing' | 'won' | 'lost'
	startTime: number
}

export default function Game() {
	const { problemId, target } = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()
	const fetcher = useFetcher()
	const { updateUser } = useUserUpdateRequest()
	const { user } = useDynamicContext()
	const userGameResults = useUserGameResults()

	const [gameState, setGameState] = useState<GameState>(() => ({
		guesses: [],
		feedbacks: [],
		attempts: 0,
		gameStatus: 'playing',
		startTime: Date.now(),
	}))
	const [currentInput, setCurrentInput] = useState('')

	// Reset game state when problem changes (new day)
	useEffect(() => {
		setGameState({
			guesses: [],
			feedbacks: [],
			attempts: 0,
			gameStatus: 'playing',
			startTime: Date.now(),
		})
		setCurrentInput('')
	}, [problemId])

	// Handle action response
	useEffect(() => {
		if (actionData?.success && actionData.error === null) {
			setGameState((prev) => ({
				...prev,
				guesses: actionData.guesses,
				feedbacks: [...prev.feedbacks, actionData.feedback],
				attempts: actionData.attempts,
				gameStatus: actionData.gameStatus,
			}))
			setCurrentInput('')
		}
	}, [actionData])

	// Update user data if game is over
	useEffect(() => {
		if (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') {
      const durationMs = actionData?.error === null && actionData?.durationMs || Date.now() - gameState.startTime
			const alreadyPlayed = userGameResults.find(
				(result) => result.problemId === problemId,
			)

			if (
				alreadyPlayed &&
        (gameState.attempts < alreadyPlayed.attempts ||
				(durationMs < alreadyPlayed.duration &&
				gameState.attempts === alreadyPlayed.attempts))
			) {
				// Update existing game result with better score
				updateUser({
					metadata: {
						gameResults: userGameResults.map((result) =>
							result.problemId === problemId
								? {
										...result,
										gameStatus: gameState.gameStatus,
										attempts: gameState.attempts,
										duration: durationMs,
									}
								: result,
						),
					},
				})
			} else if (!alreadyPlayed) {
				updateUser({
					metadata: {
						gameResults: [
							...userGameResults,
							{
								problemId,
								gameStatus: gameState.gameStatus,
								attempts: gameState.attempts,
								duration: durationMs,
							},
						],
					},
				})
			}
		}
	}, [gameState.gameStatus])

	const handleRestart = () => {
		setGameState({
			guesses: [],
			feedbacks: [],
			attempts: 0,
			gameStatus: 'playing',
			startTime: Date.now(),
		})
		setCurrentInput('')
	}

	const renderGuessRow = (
		guess: string,
		feedback: Array<{ char: string; status: string }>,
		index: number,
	) => {
		return (
			<div key={index} className="flex justify-center gap-1">
				{feedback.map((cell, cellIndex) => (
					<div
						key={cellIndex}
						className={`flex h-12 w-12 items-center justify-center border-2 text-lg font-bold ${
							cell.status === 'correct'
								? 'border-green-500 bg-green-500 text-white'
								: ''
						} ${
							cell.status === 'wrong-position'
								? 'border-yellow-500 bg-yellow-500 text-white'
								: ''
						} ${
							cell.status === 'not-used'
								? 'border-gray-400 bg-gray-400 text-white'
								: ''
						} ${cell.status === 'empty' ? 'border-gray-300 bg-white' : ''} `}
					>
						{cell.char}
					</div>
				))}
			</div>
		)
	}

	const renderEmptyRow = (index: number) => {
		return (
			<div key={`empty-${index}`} className="flex justify-center gap-1">
				{Array.from({ length: 6 }).map((_, cellIndex) => (
					<div
						key={cellIndex}
						className="h-12 w-12 border-2 border-gray-300 bg-white"
					/>
				))}
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8 flex items-center justify-between">
					<Link to="/">
						<Button variant="outline" size="sm">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to home
						</Button>
					</Link>

					<div className="text-center">
						<div className="flex items-center justify-center gap-2">
							<Calculator className="h-8 w-8 text-indigo-600" />
							<h1 className="text-4xl font-bold text-gray-900">Mathler</h1>
						</div>
						<p className="text-gray-600">
							Find the equation that equals {target}
						</p>
					</div>

					<Button variant="outline" size="sm" onClick={handleRestart}>
						<RotateCcw className="mr-2 h-4 w-4" />
						New Game
					</Button>
				</div>

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
							{/* Previous guesses */}
							{gameState.guesses.map((guess, index) =>
								renderGuessRow(guess, gameState.feedbacks[index], index),
							)}

							{/* Current input row */}
							{gameState.gameStatus === 'playing' && gameState.attempts < 6 && (
								<div className="flex justify-center gap-1">
									{Array.from({ length: 6 }).map((_, cellIndex) => (
										<Input
											key={cellIndex}
											value={currentInput[cellIndex] || ''}
											onChange={(e) => {
												const newValue = e.target.value.toUpperCase()
												if (
													newValue.length <= 1 &&
													/^[0-9+\-*/]*$/.test(newValue)
												) {
													const newInput = currentInput.split('')
													newInput[cellIndex] = newValue
													setCurrentInput(newInput.join('').slice(0, 6))

													// Auto-focus next input
													if (newValue && cellIndex < 5) {
														const nextInput = document.querySelector(
															`input[data-index="${cellIndex + 1}"]`,
														) as HTMLInputElement
														if (nextInput) nextInput.focus()
													}
												}
											}}
											onKeyDown={(e) => {
												if (
													e.key === 'Backspace' &&
													!currentInput[cellIndex] &&
													cellIndex > 0
												) {
													// Focus previous input on backspace
													const prevInput = document.querySelector(
														`input[data-index="${cellIndex - 1}"]`,
													) as HTMLInputElement
													if (prevInput) prevInput.focus()
												} else if (
													e.key === 'Enter' &&
													currentInput.length === 6
												) {
													const form = document.getElementById(
														'guess-form',
													) as HTMLFormElement
													if (form) form.requestSubmit()
												}
											}}
											data-index={cellIndex}
											className="h-12 w-12 border-2 border-gray-300 text-center text-lg font-bold focus:border-indigo-500"
											maxLength={1}
										/>
									))}
								</div>
							)}

							{/* Empty rows */}
							{Array.from({
								length:
									6 -
									gameState.guesses.length -
									(gameState.gameStatus === 'playing' ? 1 : 0),
							}).map((_, index) => renderEmptyRow(index))}
						</CardContent>

						{/* Submit Form */}
						{gameState.gameStatus === 'playing' && (
							<div className="px-6 pb-6">
								<Form method="post" id="guess-form">
									<input type="hidden" name="guess" value={currentInput} />
									<input type="hidden" name="problemId" value={problemId} />
									<input type="hidden" name="target" value={target} />
									<input
										type="hidden"
										name="attempts"
										value={gameState.attempts}
									/>
									<input
										type="hidden"
										name="startTime"
										value={gameState.startTime}
									/>
									<input
										type="hidden"
										name="guesses"
										value={JSON.stringify(gameState.guesses)}
									/>
									<input
										type="hidden"
										name="userId"
										value={user?.userId ?? 'anonymous'}
									/>
									<input
										type="hidden"
										name="userName"
										value={user?.username ?? ''}
									/>

									<Button
										type="submit"
										className="w-full"
										disabled={
											currentInput.length !== 6 ||
											fetcher.state === 'submitting'
										}
									>
										{fetcher.state === 'submitting'
											? 'Submitting...'
											: 'Submit Guess'}
									</Button>
								</Form>

								{actionData?.error && (
									<div className="mt-2 text-center text-sm text-red-600">
										{actionData.error}
									</div>
								)}

								<div className="mt-2 text-center text-sm text-gray-600">
									Target: <span className="text-lg font-bold">{target}</span>
								</div>
							</div>
						)}
					</Card>

					{/* Game Over */}
					{gameState.gameStatus !== 'playing' && actionData?.error === null && (
						<Card className="mt-4">
							<CardContent className="pt-6 text-center">
								{gameState.gameStatus === 'won' ? (
									<div className="space-y-4">
										<Trophy className="mx-auto h-12 w-12 text-yellow-500" />
										<h2 className="text-2xl font-bold text-green-600">
											Congratulations!
										</h2>
										<p>You solved it in {gameState.attempts} attempts!</p>
										<p className="text-sm text-gray-600">
											Time:{' '}
											{Math.round(actionData?.durationMs || 0) / 1000}s
										</p>
										{actionData?.correctAnswer && (
											<p className="text-sm text-gray-600">
												The equation was:{' '}
												<span className="font-mono font-bold">
													{actionData.correctAnswer}
												</span>
											</p>
										)}
									</div>
								) : (
									<div className="space-y-4">
										<h2 className="text-2xl font-bold text-red-600">
											Game Over
										</h2>
										<p>The correct equation was:</p>
										{actionData?.correctAnswer && (
											<p className="font-mono text-lg font-bold">
												{actionData.correctAnswer}
											</p>
										)}
									</div>
								)}

								<div className="mt-6 space-y-2">
									<Button onClick={handleRestart} className="w-full">
										Play Again
									</Button>
									<Link to="/leaderboard" className="block">
										<Button variant="outline" className="w-full">
											View Leaderboard
										</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Instructions */}
					<Card className="mt-4">
						<CardContent className="pt-6">
							<h3 className="mb-2 font-semibold">Instructions:</h3>
							<ul className="list-disc space-y-1 text-sm text-gray-600">
								<li>Enter a 6-character math equation that equals {target}</li>
								<li>Use numbers 0-9 and operators +, -, *, /</li>
								<li>Example: 31-2+3 = 32</li>
								<li>Green = correct position, Yellow = wrong position</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
