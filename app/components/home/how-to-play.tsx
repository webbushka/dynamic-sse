import { Brain, Target, Calculator, Trophy } from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'

export function HowToPlay() {
	return (
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
						<p className="text-sm">Possible answers: 31-2+3, 2*8+16, 30+1+1</p>
						<p className="mt-1 text-xs text-gray-500">
							All equations must be exactly 6 characters
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
