import { Calculator, Trophy } from 'lucide-react'
import { Link } from 'react-router'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'

export function FeaturesSection() {
	return (
		<div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
			<Link to="/game" className="block">
				<Card className="h-full cursor-pointer border-2 transition-shadow hover:border-indigo-300 hover:shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Calculator className="h-5 w-5 text-indigo-600" />
							Daily Challenge
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600">
							New puzzle every day with varying difficulty levels. Challenge
							yourself and improve your math skills!
						</p>
						<div className="mt-4 text-sm font-medium text-indigo-600">
							Play Today's Puzzle →
						</div>
					</CardContent>
				</Card>
			</Link>

			<Link to="/leaderboard" className="block">
				<Card className="h-full cursor-pointer border-2 transition-shadow hover:border-yellow-300 hover:shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Trophy className="h-5 w-5 text-yellow-600" />
							Leaderboard
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600">
							Connect your wallet to save scores and compete with other players
							on the global leaderboard.
						</p>
						<div className="mt-4 text-sm font-medium text-yellow-600">
							View Rankings →
						</div>
					</CardContent>
				</Card>
			</Link>
		</div>
	)
}
