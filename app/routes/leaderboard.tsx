import { data, useLoaderData } from 'react-router'
import { ConnectedWalletStatus } from '#app/components/leaderboard/connected-wallet-status'
import { GlobalLeaderboard } from '#app/components/leaderboard/global-leaderboard'
import { LeaderboardHeader } from '#app/components/leaderboard/leaderboard-header'
import { TipCard } from '#app/components/leaderboard/tip-card'
import { UserGameHistory } from '#app/components/leaderboard/user-game-history'
import { WalletConnection } from '#app/components/leaderboard/wallet-connection'
import { useLeaderboardState } from '#app/hooks/use-leaderboard-state'
import { getGlobalLeaderboard } from '#app/lib/leaderboard.server'

export async function loader() {
	const leaderboard = await getGlobalLeaderboard(10)

	return data({ leaderboard })
}

export default function Leaderboard() {
	const { leaderboard } = useLoaderData<typeof loader>()
	const {
		user,
		isLoggedIn,
		userGameResults,
		showTipModal,
		setShowTipModal,
		handleTipDeveloper,
		handleLogOut,
	} = useLeaderboardState()

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				<LeaderboardHeader />

				<div className="mx-auto max-w-4xl space-y-6">
					<TipCard
						handleTipDeveloper={handleTipDeveloper}
						showTipModal={showTipModal}
						setShowTipModal={setShowTipModal}
					/>

					{/* User Game History */}
					{isLoggedIn && userGameResults && (
						<UserGameHistory userGameResults={userGameResults} />
					)}

					{/* Wallet Connection - only show if not connected */}
					{!isLoggedIn && <WalletConnection />}

					{/* Connected Wallet Status */}
					{isLoggedIn && (
						<ConnectedWalletStatus user={user} handleLogOut={handleLogOut} />
					)}

					{/* Global Leaderboard */}
					<GlobalLeaderboard
						leaderboard={leaderboard}
						currentUserId={user?.userId}
						isLoggedIn={isLoggedIn}
					/>
				</div>
			</div>
		</div>
	)
}
