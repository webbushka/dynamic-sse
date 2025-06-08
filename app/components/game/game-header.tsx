import { ArrowLeft, Calculator, RotateCcw } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '#app/components/ui/button'

interface GameHeaderProps {
	target: number
	onRestart: () => void
}

export function GameHeader({ target, onRestart }: GameHeaderProps) {
	return (
		<div className="mb-8 flex items-center justify-between">
			<Link to="/">
				<Button variant="outline" size="sm">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to home
				</Button>
			</Link>

			<div className="text-center">
				<div className="flex items-center justify-center gap-2">
					<Calculator className="h-8 w-8 text-indigo-600" />
					<h1 className="text-4xl font-bold text-gray-900">Mathler</h1>
				</div>
				<p className="text-gray-600">Find the equation that equals {target}</p>
			</div>

			<Button variant="outline" size="sm" onClick={onRestart}>
				<RotateCcw className="mr-2 h-4 w-4" />
				New Game
			</Button>
		</div>
	)
}
