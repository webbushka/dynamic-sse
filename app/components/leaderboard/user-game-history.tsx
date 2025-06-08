import { BarChart3 } from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'

interface UserGameHistoryProps {
	userGameResults: Array<{
		problemId: string
		problemDate: string
		gameStatus: 'won' | 'lost'
		attempts: number
		duration: number
	}>
}

export function UserGameHistory({ userGameResults }: UserGameHistoryProps) {
	console.log({ userGameResults })

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BarChart3 className="h-5 w-5" />
					Your Game History
				</CardTitle>
				<CardDescription>
					Your games sorted by wins, then attempts, then duration
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="max-h-96 space-y-2 overflow-y-auto">
					{userGameResults.length > 0 ? (
						userGameResults.map((game, index) => (
							<div
								key={game.problemId}
								className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
							>
								<div className="flex items-center gap-3">
									<div
										className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
											game.gameStatus === 'won'
												? 'bg-green-500 text-white'
												: 'bg-red-500 text-white'
										} `}
									>
										{index + 1}
									</div>
									<div>
										<div className="text-sm font-semibold">
											{game.gameStatus === 'won' ? '✓ Won' : '✗ Lost'}
										</div>
										<div className="text-xs text-gray-500">
											Problem #{game.problemId.slice(-6)}
										</div>
										<div className="text-xs text-gray-500">
											Date {new Date(game.problemDate).toLocaleDateString()}
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-sm font-semibold">
										{game.attempts} attempts
									</div>
									<div className="text-xs text-gray-500">
										{Math.round(game.duration / 1000)}s
									</div>
								</div>
							</div>
						))
					) : (
						<div className="py-8 text-center text-gray-500">
							<BarChart3 className="mx-auto mb-2 h-12 w-12 opacity-50" />
							<p>No games played yet. Start playing to see your history!</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
