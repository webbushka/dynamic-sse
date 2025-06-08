import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicContextProvider as DynamicProvider } from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { createConfig, WagmiProvider } from 'wagmi'

const config = createConfig({
	chains: [mainnet, sepolia],
	multiInjectedProviderDiscovery: false,
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
	},
})

const queryClient = new QueryClient()
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
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					<DynamicWagmiConnector>{children}</DynamicWagmiConnector>
				</QueryClientProvider>
			</WagmiProvider>
		</DynamicProvider>
	) : (
		children
	)
}
