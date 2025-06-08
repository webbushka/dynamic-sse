import { data, Link, useLoaderData } from 'react-router'
import { Button } from '~/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import {
	ArrowLeft,
	LogOut,
	Wallet,
	Trophy,
	User,
	BarChart3,
	Heart,
	Coffee,
} from 'lucide-react'
import { getGlobalLeaderboard } from '~/lib/leaderboard.server'
import {
	DynamicWidget,
	useDynamicContext,
	useIsLoggedIn,
} from '@dynamic-labs/sdk-react-core'
import useUserGameResults from '~/hooks/use-user-game-results'
import { useState } from 'react'
import TipCard from '~/components/tip-card'

export async function loader() {
	const leaderboard = await getGlobalLeaderboard(10)

	return data({ leaderboard })
}

export default function Leaderboard() {
	const { leaderboard } = useLoaderData<typeof loader>()
	const { user, handleLogOut } = useDynamicContext()
	const isLoggedIn = useIsLoggedIn()
	const userGameResults = useUserGameResults()
	const [showTipModal, setShowTipModal] = useState(false)

	const handleTipDeveloper = (amount?: number) => {
		const tipAmount = amount
		if (tipAmount && tipAmount > 0) {
			// In a real app, this would integrate with a payment system or crypto wallet
			alert(
				`Thank you for your $${tipAmount} tip! 🙏\n\nIn a real implementation, this would process the payment.`,
			)
			setShowTipModal(false)
		} else {
			alert('Please enter a valid amount.')
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
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

				<div className="mx-auto max-w-4xl space-y-6">
					<TipCard
						handleTipDeveloper={handleTipDeveloper}
						showTipModal={showTipModal}
						setShowTipModal={setShowTipModal}
					/>

					{/* User Game History */}
					{isLoggedIn && userGameResults && (
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
														className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${game.gameStatus === 'won' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} `}
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
											<p>
												No games played yet. Start playing to see your history!
											</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Wallet Connection - only show if not connected */}
					{!isLoggedIn && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Wallet className="h-5 w-5" />
									Wallet Connection
								</CardTitle>
								<CardDescription>
									Connect your wallet to save scores and compete on the
									leaderboard
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col items-center space-y-4 text-center">
									<p className="text-gray-600">
										Connect your wallet to start tracking your Mathler progress
										and compete with other players.
									</p>
									<DynamicWidget />
									<p className="text-xs text-gray-500">
										Powered by Dynamic - supports MetaMask, WalletConnect, and
										more
									</p>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Connected Wallet Status */}
					{isLoggedIn && (
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
										<span className="font-semibold">
											Connected: {user?.username}
										</span>
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
					)}

					{/* Global Leaderboard */}
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
													className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${index === 0 ? 'bg-yellow-500 text-white' : ''} ${index === 1 ? 'bg-gray-400 text-white' : ''} ${index === 2 ? 'bg-amber-600 text-white' : ''} ${index > 2 ? 'bg-gray-200 text-gray-700' : ''} `}
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
												{player.userId === user?.userId && (
													<span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
														You
													</span>
												)}
											</div>
											<div className="text-right">
												<div className="font-semibold">
													{player.averageScore} avg
												</div>
												<div className="text-xs text-gray-500">
													{player.gamesPlayed} games
												</div>
											</div>
										</div>
									))
								) : (
									<div className="py-8 text-center text-gray-500">
										<Trophy className="mx-auto mb-2 h-12 w-12 opacity-50" />
										<p>No scores yet. Be the first to play!</p>
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
				</div>
			</div>
		</div>
	)
}
