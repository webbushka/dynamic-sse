import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

export default function useGameResults() {
	const { user } = useDynamicContext()

	const userGameResults =
		(user?.metadata as { gameResults: any[] })?.gameResults || []

	return userGameResults
}
