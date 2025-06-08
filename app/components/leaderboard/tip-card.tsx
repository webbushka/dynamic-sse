'use client'

import { Heart, Coffee, Trophy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '#app/components/ui/dialog'
import { Input } from '#app/components/ui/input'

export function TipCard({
	handleTipDeveloper,
	showTipModal,
	setShowTipModal,
}: {
	handleTipDeveloper: (amount?: number) => void
	showTipModal: boolean
	setShowTipModal: (show: boolean) => void
}) {
	const [customAmount, setCustomAmount] = useState('')

	return (
		<Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-orange-700">
					<Coffee className="h-5 w-5" />
					Support the Developer
				</CardTitle>
				<CardDescription className="text-orange-600">
					Enjoying Mathler? Consider supporting the development with a tip!
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<p className="mb-2 text-sm text-gray-700">
							Your support helps keep Mathler free and enables new features like
							daily challenges, improved puzzles, and enhanced gameplay.
						</p>
						<div className="flex items-center gap-1 text-xs text-gray-600">
							<Heart className="h-3 w-3 text-red-500" />
							<span>Made with love by aj webb</span>
						</div>
					</div>
					<Dialog open={showTipModal} onOpenChange={setShowTipModal}>
						<DialogTrigger asChild>
							<Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600">
								<Coffee className="mr-2 h-4 w-4" />
								Tip Developer
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2">
									<Coffee className="h-5 w-5 text-orange-500" />
									Tip the Developer
								</DialogTitle>
								<DialogDescription>
									Support the development of Mathler with a tip
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<p className="text-sm text-gray-600">
									Thank you for considering a tip! Your support helps maintain
									and improve Mathler with new features, better puzzles, and
									enhanced gameplay.
								</p>

								<div className="grid grid-cols-3 gap-2">
									<Button
										variant="outline"
										className="flex h-auto flex-col items-center p-4"
										onClick={() => handleTipDeveloper(3)}
									>
										<Coffee className="mb-1 h-4 w-4" />
										<span className="text-xs">$3</span>
										<span className="text-xs text-gray-500">Coffee</span>
									</Button>
									<Button
										variant="outline"
										className="flex h-auto flex-col items-center p-4"
										onClick={() => handleTipDeveloper(5)}
									>
										<Heart className="mb-1 h-4 w-4 text-red-500" />
										<span className="text-xs">$5</span>
										<span className="text-xs text-gray-500">Support</span>
									</Button>
									<Button
										variant="outline"
										className="flex h-auto flex-col items-center p-4"
										onClick={() => handleTipDeveloper(10)}
									>
										<Trophy className="mb-1 h-4 w-4 text-yellow-500" />
										<span className="text-xs">$10</span>
										<span className="text-xs text-gray-500">Champion</span>
									</Button>
								</div>

								<div className="text-center">
									<p className="mb-3 text-xs text-gray-500">
										Or enter a custom amount:
									</p>
									<div className="flex gap-2">
										<Input
											type="number"
											placeholder="Amount"
											value={customAmount}
											onChange={(e) => setCustomAmount(e.target.value)}
											className="flex-1"
											min="1"
											step="0.01"
										/>
										<Button
											onClick={() => handleTipDeveloper(Number(customAmount))}
											size="sm"
										>
											Tip
										</Button>
									</div>
								</div>

								<div className="flex gap-2">
									<Button
										variant="outline"
										onClick={() => setShowTipModal(false)}
										className="flex-1"
									>
										Maybe Later
									</Button>
									<Button
										onClick={() => handleTipDeveloper(5)}
										className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
									>
										<Heart className="mr-2 h-4 w-4" />
										Support $5
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</CardContent>
		</Card>
	)
}
