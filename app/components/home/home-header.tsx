import { Calculator } from 'lucide-react'

export function HomeHeader() {
	return (
		<header className="mb-12 text-center">
			<div className="mb-4 flex items-center justify-center gap-2">
				<Calculator className="h-8 w-8 text-indigo-600" />
				<h1 className="text-4xl font-bold text-gray-900">Mathler</h1>
			</div>
			<p className="mx-auto max-w-2xl text-xl text-gray-600">
				The daily math puzzle game. Guess the equation that equals the target
				number!
			</p>
		</header>
	)
}
