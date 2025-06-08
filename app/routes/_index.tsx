import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import { Calculator, Trophy, Brain, Target } from 'lucide-react'
import { DynamicWidget, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'

export default function Index() {
	const isLoggedIn = useIsLoggedIn()

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<header className="mb-12 text-center">
					<div className="mb-4 flex items-center justify-center gap-2">
						<Calculator className="h-8 w-8 text-indigo-600" />
						<h1 className="text-4xl font-bold text-gray-900">Mathler</h1>
					</div>
					<p className="mx-auto max-w-2xl text-xl text-gray-600">
						The daily math puzzle game. Guess the equation that equals the
						target number!
					</p>
				</header>

				{/* How to Play */}
				<div className="mx-auto mb-12 max-w-4xl">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Brain className="h-5 w-5" />
								How to Play
							</CardTitle>
							<CardDescription>
								Guess the math equation in 6 tries or less
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-3">
								<div className="text-center">
									<Target className="mx-auto mb-2 h-8 w-8 text-green-600" />
									<h3 className="font-semibold">Target Number</h3>
									<p className="text-sm text-gray-600">
										Find an equation that equals the given target
									</p>
								</div>
								<div className="text-center">
									<Calculator className="mx-auto mb-2 h-8 w-8 text-blue-600" />
									<h3 className="font-semibold">Math Operations</h3>
									<p className="text-sm text-gray-600">
										Use +, -, *, / and numbers 0-9
									</p>
								</div>
								<div className="text-center">
									<Trophy className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
									<h3 className="font-semibold">Color Feedback</h3>
									<p className="text-sm text-gray-600">
										Green = correct, Yellow = wrong position, Gray = not used
									</p>
								</div>
							</div>

							<div className="rounded-lg bg-gray-50 p-4">
								<h4 className="mb-2 font-semibold">Example:</h4>
								<p className="text-sm">
									Target: <span className="font-bold">32</span>
								</p>
								<p className="text-sm">
									Possible answers: 31-2+3, 2*8+16, 30+1+1
								</p>
								<p className="mt-1 text-xs text-gray-500">
									All equations must be exactly 6 characters
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Action Buttons */}
				<div className="space-y-4 text-center">
					<Link to="/game">
						<Button size="lg" className="px-8 py-3 text-lg">
							Start Playing
						</Button>
					</Link>

					{!isLoggedIn && (
						<div className="flex flex-col items-center space-y-2">
							<p className="text-sm text-gray-600">
								Want to save your scores and compete on the leaderboard?
							</p>
							<DynamicWidget />
						</div>
					)}
				</div>

				{/* Features */}
				<div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
					<Link to="/game" className="block">
						<Card className="h-full cursor-pointer border-2 transition-shadow hover:border-indigo-300 hover:shadow-lg">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Calculator className="h-5 w-5 text-indigo-600" />
									Daily Challenge
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									New puzzle every day with varying difficulty levels. Challenge
									yourself and improve your math skills!
								</p>
								<div className="mt-4 text-sm font-medium text-indigo-600">
									Play Today's Puzzle →
								</div>
							</CardContent>
						</Card>
					</Link>

					<Link to="/leaderboard" className="block">
						<Card className="h-full cursor-pointer border-2 transition-shadow hover:border-yellow-300 hover:shadow-lg">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Trophy className="h-5 w-5 text-yellow-600" />
									Leaderboard
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Connect your wallet to save scores and compete with other
									players on the global leaderboard.
								</p>
								<div className="mt-4 text-sm font-medium text-yellow-600">
									View Rankings →
								</div>
							</CardContent>
						</Card>
					</Link>
				</div>
			</div>
		</div>
	)
}
