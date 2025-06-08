import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { Link } from 'react-router'
import { Button } from '#app/components/ui/button'

interface ActionButtonsProps {
	isLoggedIn: boolean
}

export function ActionButtons({ isLoggedIn }: ActionButtonsProps) {
	return (
		<div className="space-y-4 text-center">
			<Link to="/game">
				<Button size="lg" className="px-8 py-3 text-lg">
					Start Playing
				</Button>
			</Link>

			{!isLoggedIn && (
				<div className="flex flex-col items-center space-y-2">
					<p className="text-sm text-gray-600">
						Want to save your scores and compete on the leaderboard?
					</p>
					<DynamicWidget />
				</div>
			)}
		</div>
	)
}
