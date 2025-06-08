import { Trophy } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '#app/components/ui/button'
import { Card, CardContent } from '#app/components/ui/card'
import { type GameState } from '#app/hooks/use-game-state'

interface GameOverProps {
	gameState: GameState
	correctAnswer: string | null
	durationMs: number | undefined
	onRestart: () => void
}

export function GameOver({
	gameState,
	correctAnswer,
	durationMs,
	onRestart,
}: GameOverProps) {
	return (
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
							Time: {Math.round(durationMs || 0) / 1000}s
						</p>
						{correctAnswer && (
							<p className="text-sm text-gray-600">
								The equation was:{' '}
								<span className="font-mono font-bold">{correctAnswer}</span>
							</p>
						)}
					</div>
				) : (
					<div className="space-y-4">
						<h2 className="text-2xl font-bold text-red-600">Game Over</h2>
						<p>The correct equation was:</p>
						{correctAnswer && (
							<p className="font-mono text-lg font-bold">{correctAnswer}</p>
						)}
					</div>
				)}

				<div className="mt-6 space-y-2">
					<Button onClick={onRestart} className="w-full">
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
	)
}
