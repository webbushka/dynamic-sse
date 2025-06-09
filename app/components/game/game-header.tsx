import { ArrowLeft, Calculator, RotateCcw } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '#app/components/ui/button'

interface GameHeaderProps {
	target: number
	onRestart: () => void
}

export function GameHeader({ target, onRestart }: GameHeaderProps) {
	return (
		<div className="mb-8 grid grid-cols-2 items-center justify-between gap-4 sm:grid-cols-[auto_1fr_auto] sm:gap-0">
			<Link to="/">
				<Button variant="outline" size="sm">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to home
				</Button>
			</Link>

			<div className="col-span-full text-center sm:col-span-1">
				<div className="flex items-center justify-center gap-2">
					<Calculator className="h-8 w-8 text-indigo-600" />
					<h1 className="text-4xl font-bold text-gray-900">Mathler</h1>
				</div>
				<p className="text-gray-600">Find the equation that equals {target}</p>
			</div>

			<Button
				variant="outline"
				size="sm"
				onClick={onRestart}
				className="col-start-2 row-start-1 sm:col-auto sm:row-auto"
			>
				<RotateCcw className="mr-2 h-4 w-4" />
				New Game
			</Button>
		</div>
	)
}
