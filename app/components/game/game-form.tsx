import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { Form, useFetcher } from 'react-router'
import { Button } from '#app/components/ui/button'
import { type GameState } from '#app/hooks/use-game-state'

interface GuessFormProps {
	gameState: GameState
	currentInput: string
	problemId: string
	target: number
	error: string | null
}

export function GuessForm({
	gameState,
	currentInput,
	problemId,
	target,
	error,
}: GuessFormProps) {
	const fetcher = useFetcher()
	const { user } = useDynamicContext()

	return (
		<div className="px-6 pb-6">
			<Form method="post" id="guess-form">
				<input type="hidden" name="guess" value={currentInput} />
				<input type="hidden" name="problemId" value={problemId} />
				<input type="hidden" name="target" value={target} />
				<input type="hidden" name="attempts" value={gameState.attempts} />
				<input type="hidden" name="startTime" value={gameState.startTime} />
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
				<input type="hidden" name="userName" value={user?.username ?? ''} />

				<Button
					type="submit"
					className="w-full"
					disabled={currentInput.length !== 6 || fetcher.state === 'submitting'}
				>
					{fetcher.state === 'submitting' ? 'Submitting...' : 'Submit Guess'}
				</Button>
			</Form>

			{error && (
				<div className="mt-2 text-center text-sm text-red-600">{error}</div>
			)}
		</div>
	)
}
