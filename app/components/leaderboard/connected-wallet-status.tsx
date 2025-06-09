import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { LogOut, User } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'

interface ConnectedWalletStatusProps {
	user: any
	handleLogOut: () => void
}

export function ConnectedWalletStatus({
	user,
	handleLogOut,
}: ConnectedWalletStatusProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<User className="h-5 w-5" />
					Connected Wallet
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4 text-center">
					<div className="flex items-center justify-center gap-2 text-green-600">
						<User className="h-5 w-5" />
						<span className="font-semibold">Connected: {user?.username}</span>
					</div>
					<div className="mt-4 flex justify-center">
						<DynamicWidget />
					</div>
					<div className="flex justify-center gap-2">
						<Link to="/game">
							<Button>Start Playing</Button>
						</Link>
						<Button variant="outline" onClick={handleLogOut}>
							<LogOut className="mr-2 h-4 w-4" />
							Logout
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
