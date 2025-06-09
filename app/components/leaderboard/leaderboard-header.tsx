import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '#app/components/ui/button'

export function LeaderboardHeader() {
	return (
		<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0 md:mb-8">
			<Link to="/" className="self-start sm:self-auto">
				<Button variant="outline" size="sm" className="h-9 px-3">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Home
				</Button>
			</Link>
			<h1 className="text-center text-2xl font-bold text-gray-900 sm:text-left md:text-3xl">
				Leaderboards
			</h1>
			<div className="hidden w-20 sm:block md:w-24" />
		</div>
	)
}
