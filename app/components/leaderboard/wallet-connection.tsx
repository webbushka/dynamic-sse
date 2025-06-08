import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { Wallet } from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'

export function WalletConnection() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Wallet className="h-5 w-5" />
					Wallet Connection
				</CardTitle>
				<CardDescription>
					Connect your wallet to save scores and compete on the leaderboard
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center space-y-4 text-center">
					<p className="text-gray-600">
						Connect your wallet to start tracking your Mathler progress and
						compete with other players.
					</p>
					<DynamicWidget />
					<p className="text-xs text-gray-500">
						Powered by Dynamic - supports MetaMask, WalletConnect, and more
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
