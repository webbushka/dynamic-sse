import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '#app/components/ui/button'

export function LeaderboardHeader() {
	return (
		<div className="mb-8 flex items-center justify-between">
			<Link to="/">
				<Button variant="outline" size="sm">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Home
				</Button>
			</Link>
			<h1 className="text-3xl font-bold text-gray-900">Leaderboards</h1>
			<div className="w-24" />
		</div>
	)
}
