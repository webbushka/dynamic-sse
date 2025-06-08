import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'
import { useState } from 'react'
import useUserGameResults from '#app/hooks/use-user-game-results'

export function useLeaderboardState() {
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

	return {
		user,
		isLoggedIn,
		userGameResults,
		showTipModal,
		setShowTipModal,
		handleTipDeveloper,
		handleLogOut,
	}
}
