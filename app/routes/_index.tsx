import { useIsLoggedIn } from '@dynamic-labs/sdk-react-core'
import { ActionButtons } from '#app/components/home/action-buttons'
import { FeaturesSection } from '#app/components/home/features-section'
import { HomeHeader } from '#app/components/home/home-header'
import { HowToPlay } from '#app/components/home/how-to-play'

export default function Index() {
	const isLoggedIn = useIsLoggedIn()

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				<HomeHeader />
				<HowToPlay />
				<ActionButtons isLoggedIn={isLoggedIn} />
				<FeaturesSection />
			</div>
		</div>
	)
}
