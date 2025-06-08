import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicContextProvider as DynamicProvider } from '@dynamic-labs/sdk-react-core'

export function DynamicContextProvider({
	children,
	environmentId,
}: {
	children: any
	environmentId?: string
}) {
	return environmentId ? (
		<DynamicProvider
			settings={{
				// Find your environment id at https://app.dynamic.xyz/dashboard/developer
				environmentId,
				walletConnectors: [EthereumWalletConnectors],
			}}
		>
			{children}
		</DynamicProvider>
	) : (
		children
	)
}
