import { data, useLoaderData } from 'react-router'
import { AddFunds } from '#app/components/leaderboard/add-funds.tsx'
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
		showAddFundsModal,
		setShowAddFundsModal,
		attemptedTipAmount,
		walletBalance,
		walletAddress,
		handleAddFunds,
		handleCancelTip,
		txIsPending,
		txIsSuccess,
		txIsError,
		txError,
		addIsPending,
		handleRetry,
	} = useLeaderboardState()

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				<LeaderboardHeader />

				<div className="mx-auto max-w-4xl space-y-6">
					{isLoggedIn && (
						<>
							<TipCard
								handleTipDeveloper={handleTipDeveloper}
								showTipModal={showTipModal}
								setShowTipModal={setShowTipModal}
							/>

							<AddFunds
								showAddFundsModal={showAddFundsModal}
								setShowAddFundsModal={setShowAddFundsModal}
								attemptedTipAmount={attemptedTipAmount}
								walletBalance={walletBalance}
								walletAddress={walletAddress}
								handleAddFunds={handleAddFunds}
								handleCancelTip={handleCancelTip}
								txIsPending={txIsPending}
								txIsSuccess={txIsSuccess}
								txIsError={txIsError}
								txError={txError}
								addIsPending={addIsPending}
								handleRetry={handleRetry}
							/>
						</>
					)}

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
