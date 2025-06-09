'use client'

import { AlertTriangle, CreditCard, Check, X, Loader2 } from 'lucide-react'
import { Button } from '#app/components/ui/button'
import { CopyText } from '#app/components/ui/copy-text'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '#app/components/ui/dialog'

export function AddFunds({
	showAddFundsModal,
	setShowAddFundsModal,
	attemptedTipAmount,
	walletBalance,
	walletAddress,
	handleAddFunds,
	handleCancelTip,
	txIsSuccess,
	txIsError,
	txIsPending,
	txError,
	addIsPending,
	handleRetry,
}: {
	showAddFundsModal: boolean
	setShowAddFundsModal: (show: boolean) => void
	attemptedTipAmount: number
	walletBalance: number
	walletAddress: string
	handleAddFunds: () => void
	handleCancelTip: () => void
	txIsSuccess?: boolean
	txIsError?: boolean
	txError?: unknown
	txIsPending?: boolean
	addIsPending?: boolean
	handleRetry?: () => void
}) {
	const shortfall = attemptedTipAmount - walletBalance

	const obfuscateWalletAddress = (address: string): string =>
		`${address.slice(0, 8)}...${address.slice(-8)}`

	return (
		<Dialog
			open={showAddFundsModal}
			onOpenChange={txIsPending ? undefined : setShowAddFundsModal}
		>
			<DialogContent className="sm:mx-auto sm:max-w-md">
				{/* Default/Idle State */}
				{!txIsPending && !txIsSuccess && !txIsError && (
					<>
						<DialogHeader className="text-center sm:text-left">
							<DialogTitle className="flex flex-col items-center gap-2 text-lg text-red-600 sm:flex-row sm:text-xl">
								<AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
								Insufficient Funds
							</DialogTitle>
							<DialogDescription className="text-sm sm:text-base">
								You don't have enough funds in your wallet to complete this
								transaction
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div className="rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4">
								<div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
									<span className="text-xs text-gray-600 sm:text-sm">
										Tip Amount:
									</span>
									<span className="text-sm font-semibold break-all text-red-600 sm:text-base">
										{attemptedTipAmount.toFixed(18)} ETH
									</span>
								</div>
								<div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
									<span className="text-xs text-gray-600 sm:text-sm">
										Wallet Balance:
									</span>
									<span className="text-sm font-semibold break-all text-green-600 sm:text-base">
										{walletBalance.toFixed(18)} ETH
									</span>
								</div>
								<hr className="my-2 border-red-200" />
								<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
									<span className="text-xs font-medium text-gray-700 sm:text-sm">
										Needed:
									</span>
									<span className="text-sm font-bold break-all text-red-600 sm:text-base">
										{shortfall.toFixed(18)} ETH more
									</span>
								</div>
							</div>

							<p className="px-2 text-center text-xs text-gray-600 sm:px-0 sm:text-sm">
								Copy your wallet address below and add funds to your wallet to
								complete this tip and support the developer.
							</p>

							{addIsPending ? (
								<Button
									onClick={handleRetry}
									className="h-10 w-full bg-blue-600 hover:bg-blue-700 sm:h-11"
								>
									<CreditCard className="mr-2 h-4 w-4" />
									<span className="text-sm sm:text-base">Retry Tip</span>
								</Button>
							) : (
								<div className="flex flex-col gap-2 sm:flex-row">
									<Button
										variant="outline"
										onClick={handleCancelTip}
										className="h-10 flex-1 sm:h-11"
									>
										<span className="text-sm sm:text-base">Cancel</span>
									</Button>
									<Button
										onClick={handleAddFunds}
										className="h-10 flex-1 bg-blue-600 hover:bg-blue-700 sm:h-11"
									>
										<CreditCard className="mr-2 h-4 w-4" />
										<span className="text-sm sm:text-base">Add Funds</span>
									</Button>
								</div>
							)}

							<div className="px-2 text-center sm:px-0">
								<p className="text-xs break-words text-gray-500">
									Funds will be added to your connected wallet:{' '}
									<span className="mt-1 flex justify-center sm:mt-0">
										<CopyText className="font-mono">
											{obfuscateWalletAddress(walletAddress)}
										</CopyText>
									</span>
								</p>
							</div>
						</div>
					</>
				)}

				{/* Pending State */}
				{txIsPending && (
					<div className="space-y-4 py-6 text-center sm:py-8">
						<Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600 sm:h-12 sm:w-12" />
						<DialogTitle className="text-lg sm:text-xl">
							Processing Payment
						</DialogTitle>
						<DialogDescription className="px-2 text-sm sm:px-0 sm:text-base">
							Please wait while we process your payment
						</DialogDescription>
						<div className="mx-2 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700 sm:mx-0 sm:text-sm">
							Do not close this window or refresh the page.
						</div>
					</div>
				)}

				{/* Success State */}
				{txIsSuccess && (
					<div className="space-y-4 py-6 text-center sm:py-8">
						<div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 sm:h-12 sm:w-12">
							<Check className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
						</div>
						<DialogTitle className="text-lg text-green-600 sm:text-xl">
							Transaction Completed Successfully!
						</DialogTitle>
						<DialogDescription className="px-2 text-sm break-words sm:px-0 sm:text-base">
							Thank you! Your {attemptedTipAmount.toFixed(18)} ETH tip was
							received!
						</DialogDescription>
						<Button
							onClick={handleCancelTip}
							className="h-10 w-full bg-green-600 hover:bg-green-700 sm:h-11 sm:w-auto"
						>
							<span className="text-sm sm:text-base">Close</span>
						</Button>
					</div>
				)}

				{/* Error State */}
				{txIsError && (
					<div className="space-y-4 py-6 text-center sm:py-8">
						<div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 sm:h-12 sm:w-12">
							<X className="h-5 w-5 text-red-600 sm:h-6 sm:w-6" />
						</div>
						<DialogTitle className="text-lg text-red-600 sm:text-xl">
							Payment Failed
						</DialogTitle>
						<DialogDescription className="px-2 text-sm sm:px-0 sm:text-base">
							We couldn't process your payment.
						</DialogDescription>
						<div className="mx-2 rounded-lg bg-red-50 p-3 text-xs break-words text-red-700 sm:mx-0 sm:text-sm">
							Error: {JSON.stringify(txError)}
						</div>
						<div className="flex flex-col gap-2 sm:flex-row">
							<Button
								variant="outline"
								onClick={handleCancelTip}
								className="h-10 flex-1 sm:h-11"
							>
								<span className="text-sm sm:text-base">Cancel</span>
							</Button>
							<Button
								onClick={handleRetry}
								className="h-10 flex-1 bg-blue-600 hover:bg-blue-700 sm:h-11"
							>
								<CreditCard className="mr-2 h-4 w-4" />
								<span className="text-sm sm:text-base">Try Again</span>
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
