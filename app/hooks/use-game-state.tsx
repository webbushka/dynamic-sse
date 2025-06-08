import { useUserUpdateRequest } from '@dynamic-labs/sdk-react-core'
import { useState, useEffect } from 'react'
import { useActionData } from 'react-router'
import useUserGameResults from '#app/hooks/use-user-game-results'
import { type ActionData } from '#app/types/game-types'

export interface GameState {
	guesses: string[]
	feedbacks: Array<Array<{ char: string; status: string }>>
	attempts: number
	gameStatus: 'playing' | 'won' | 'lost'
	startTime: number
}

export function useGameState(problemId: string, problemDate: Date) {
	const actionData = useActionData<ActionData>()
	const { updateUser } = useUserUpdateRequest()
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
				guesses: actionData.guesses ?? [],
				feedbacks: [...prev.feedbacks, actionData.feedback ?? []],
				attempts: actionData.attempts ?? prev.attempts,
				gameStatus: actionData.gameStatus ?? prev.gameStatus,
			}))
			setCurrentInput('')
		}
	}, [actionData])

	// Update user data if game is over
	useEffect(() => {
		if (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') {
			const durationMs =
				(actionData?.error === null && actionData?.durationMs) ||
				Date.now() - gameState.startTime
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
				void updateUser({
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
				void updateUser({
					metadata: {
						gameResults: [
							...userGameResults,
							{
								problemId,
								problemDate: problemDate.toISOString(),
								gameStatus: gameState.gameStatus,
								attempts: gameState.attempts,
								duration: durationMs,
							},
						],
					},
				})
			}
		}
	}, [
		actionData,
		gameState.attempts,
		gameState.gameStatus,
		gameState.startTime,
		problemId,
		problemDate,
		updateUser,
		userGameResults,
	])

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

	return {
		gameState,
		currentInput,
		setCurrentInput,
		handleRestart,
		actionData,
	}
}
