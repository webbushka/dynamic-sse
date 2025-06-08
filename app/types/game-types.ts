export interface ActionData {
	success: boolean
	feedback?: Array<{ char: string; status: string }>
	gameStatus?: 'playing' | 'won' | 'lost'
	attempts?: number
	guesses?: string[]
	durationMs?: number
	correctAnswer?: string | null
	error: string | null
}
