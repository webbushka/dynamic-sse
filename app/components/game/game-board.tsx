import { useEffect, useRef } from 'react'
import { Input } from '#app/components/ui/input'
import { type GameState } from '#app/hooks/use-game-state'

interface GameBoardProps {
	gameState: GameState
	target: number
	currentInput: string
	setCurrentInput: (input: string) => void
}

export function GameBoard({
	gameState,
	target,
	currentInput,
	setCurrentInput,
}: GameBoardProps) {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])

	// Auto-focus the first empty input or the last input with content
	useEffect(() => {
		if (gameState.gameStatus === 'playing' && gameState.attempts < 6) {
			const firstEmptyIndex = currentInput.length
			const targetIndex = Math.min(firstEmptyIndex, 5)

			if (inputRefs.current[targetIndex]) {
				inputRefs.current[targetIndex]?.focus()
			}
		}
	}, [currentInput, gameState.gameStatus, gameState.attempts])

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
						} ${cell.status === 'wrong-position' ? 'border-yellow-500 bg-yellow-500 text-white' : ''} ${
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
		<div className="space-y-2">
			{/* Previous guesses */}
			{gameState.guesses.map((guess, index) =>
				renderGuessRow(guess, gameState.feedbacks[index] ?? [], index),
			)}

			{/* Current input row */}
			{gameState.gameStatus === 'playing' && gameState.attempts < 6 && (
				<div className="flex justify-center gap-1">
					{Array.from({ length: 6 }).map((_, cellIndex) => (
						<Input
							key={cellIndex}
							ref={(el) => {
								inputRefs.current[cellIndex] = el
							}}
							value={currentInput[cellIndex] || ''}
							onChange={(e) => {
								const newValue = e.target.value.toUpperCase()
								if (newValue.length <= 1 && /^[0-9+\-*/]*$/.test(newValue)) {
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
								} else if (e.key === 'Enter' && currentInput.length === 6) {
									const form = document.getElementById(
										'guess-form',
									) as HTMLFormElement
									if (form) form.requestSubmit()
								}
							}}
							data-index={cellIndex}
							className="h-12 w-12 rounded-none border-2 border-gray-300 text-center text-lg font-bold focus:border-indigo-500"
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

			<div className="mt-2 text-center text-sm text-gray-600">
				Target: <span className="text-lg font-bold">{target}</span>
			</div>
		</div>
	)
}
