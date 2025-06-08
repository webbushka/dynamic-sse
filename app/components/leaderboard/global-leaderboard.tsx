import { Trophy } from 'lucide-react'
import { Link } from 'react-router'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'

interface LeaderboardEntry {
	userId: string
	userName?: string
	averageScore: number
	gamesPlayed: number
}

interface GlobalLeaderboardProps {
	leaderboard: LeaderboardEntry[]
	currentUserId?: string
	isLoggedIn: boolean
}

export function GlobalLeaderboard({
	leaderboard,
	currentUserId,
	isLoggedIn,
}: GlobalLeaderboardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Trophy className="h-5 w-5" />
					Today's Global Leaderboard
				</CardTitle>
				<CardDescription>
					Top players ranked by average score (lower is better)
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{leaderboard.length > 0 ? (
						leaderboard.map((player, index) => (
							<div
								key={player.userId}
								className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
							>
								<div className="flex items-center gap-3">
									<div
										className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
											index === 0 ? 'bg-yellow-500 text-white' : ''
										} ${index === 1 ? 'bg-gray-400 text-white' : ''} ${
											index === 2 ? 'bg-amber-600 text-white' : ''
										} ${index > 2 ? 'bg-gray-200 text-gray-700' : ''} `}
									>
										{index + 1}
									</div>
									<span className="font-mono text-sm">
										{player.userName
											? player.userName
											: player.userId.length > 20
												? `${player.userId.slice(0, 6)}...${player.userId.slice(-4)}`
												: player.userId}
									</span>
									{player.userId === currentUserId && (
										<span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
											You
										</span>
									)}
								</div>
								<div className="text-right">
									<div className="font-semibold">{player.averageScore} avg</div>
									<div className="text-xs text-gray-500">
										{player.gamesPlayed} games
									</div>
								</div>
							</div>
						))
					) : (
						<div className="py-8 text-center text-gray-500">
							<Trophy className="mx-auto mb-2 h-12 w-12 opacity-50" />
							<p>
								No scores yet.{' '}
								<Link to="/game" className="hover:underline">
									Be the first to play!
								</Link>
							</p>
						</div>
					)}
				</div>

				{!isLoggedIn && (
					<div className="mt-4 rounded-lg bg-blue-50 p-4 text-center">
						<p className="text-sm text-blue-700">
							Connect your wallet to see your ranking and compete!
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
