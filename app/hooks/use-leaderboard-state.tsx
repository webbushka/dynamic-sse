import {
	useDynamicContext,
	useIsLoggedIn,
	useOnramp,
} from '@dynamic-labs/sdk-react-core'
import { useEffect, useState } from 'react'
import { useRouteLoaderData } from 'react-router'
import { parseEther } from 'viem'
import { useSendTransaction } from 'wagmi'
import useUserGameResults from '#app/hooks/use-user-game-results'

export function useLeaderboardState() {
	const data = useRouteLoaderData<any>('root')
	const { user, handleLogOut, primaryWallet } = useDynamicContext()
	const { open } = useOnramp()
	const { isSuccess, sendTransaction, isPending, isError, error } =
		useSendTransaction()
	const isLoggedIn = useIsLoggedIn()
	const userGameResults = useUserGameResults()
	const [showTipModal, setShowTipModal] = useState(false)
	const [currentEthAmount, setCurrentEthAmount] = useState<number | null>(null)
	const [showAddFundsModal, setShowAddFundsModal] = useState(false)
	const [attemptedTipAmount, setAttemptedTipAmount] = useState<number>(0)
	const [walletBalance, setWalletBalance] = useState<number>(0)
	const [walletAddress, setWalletAddress] = useState<string>('')
	const [addIsPending, setAddIsPending] = useState(false)

	// get the current ETH amount from the coingecko API
	useEffect(() => {
		const getAmount = async () => {
			try {
				const res = await fetch(
					'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
				)
				if (!res.ok) {
					throw new Error('Failed to fetch ETH price')
				}
				const data = (await res.json()) as { ethereum: { usd: number } }
				const ethPrice = data.ethereum.usd
				return ethPrice
			} catch (err) {
				console.error('Error fetching ETH price:', err)
				return
			}
		}

		if (!currentEthAmount) {
			void getAmount().then((amount) => {
				if (amount) {
					setCurrentEthAmount(amount)
				}
			})
		} else {
			console.log('Current ETH amount already set:', currentEthAmount)
		}
	}, [currentEthAmount])

	const getAmountInEth = async (amount: number) => {
		if (!currentEthAmount) {
			console.error('Current ETH amount is not set')
			return 0
		}
		return amount / currentEthAmount
	}

	const hasSufficientFundsForTipAmount = async (amount: number) => {
		const currBalance = await primaryWallet?.getBalance()

		setWalletBalance(Number(currBalance))
		setWalletAddress(primaryWallet?.address ?? '')

		if (!currBalance) {
			return false
		}
		return Number(currBalance) >= amount
	}

	const handleSendTransaction = async (tipAmount: number) => {
		try {
			sendTransaction({
				to: data?.paymentAddress as `0x${string}`,
				value: parseEther(tipAmount.toFixed(18)),
			})
		} catch (err) {
			console.error('Error sending transaction:', err)
			alert(
				`Failed to send transaction: ${err instanceof Error ? err.message : 'Unknown error'}`,
			)
		}
	}

	const handleTipDeveloper = async (amount: number) => {
		const tipAmount = await getAmountInEth(amount)
		const hasFunds = await hasSufficientFundsForTipAmount(tipAmount)
		if (tipAmount > 0 && hasFunds) {
			// In a real app, this would integrate with a payment system or crypto wallet
			await handleSendTransaction(tipAmount)
			setShowTipModal(false)
			setShowAddFundsModal(true)
		} else if (tipAmount && !hasFunds) {
			setAttemptedTipAmount(tipAmount)
			setShowAddFundsModal(true)
		} else {
			alert('Please enter a valid amount.')
		}
	}

	const handleAddFunds = async () => {
		setAddIsPending(true)
		await open({
			onrampProvider: 'megaETH' as any,
		})
	}

	const handleCancelTip = () => {
		setShowTipModal(false)
		setShowAddFundsModal(false)
		setAttemptedTipAmount(0)
		setAddIsPending(false)
	}

	const handleRetry = async () => {
		await handleSendTransaction(attemptedTipAmount)
	}

	return {
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
		addIsPending,
		handleRetry,
		txIsPending: isPending,
		txIsSuccess: isSuccess,
		txIsError: isError,
		txError: error,
	}
}
