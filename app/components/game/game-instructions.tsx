import { Card, CardContent } from '#app/components/ui/card'

interface GameInstructionsProps {
	target: number
}

export function GameInstructions({ target }: GameInstructionsProps) {
	return (
		<Card className="mt-4">
			<CardContent className="pt-6">
				<h3 className="mb-2 font-semibold">Instructions:</h3>
				<ul className="list-disc space-y-1 text-sm text-gray-600">
					<li>Enter a 6-character math equation that equals {target}</li>
					<li>Use numbers 0-9 and operators +, -, *, /</li>
					<li>Example: 31-2+3 = 32</li>
					<li>Green = correct position, Yellow = wrong position</li>
				</ul>
			</CardContent>
		</Card>
	)
}
