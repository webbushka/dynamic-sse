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
				environmentId,
				walletConnectors: [EthereumWalletConnectors],
				overrides: {
					onrampOptions: () => {
						return [
							{
								id: 'megaETH',
								url: 'https://testnet.megaeth.com/#2',
								displayName: 'Mega ETH',
								iconUrl:
									'https://images.crunchbase.com/image/upload/c_pad,h_150,w_150,f_auto,b_black,q_auto:eco,dpr_2/837846854d834bdebff6dd1354d32b55',
								openMode: 'popup',
							},
						]
					},
				},
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
