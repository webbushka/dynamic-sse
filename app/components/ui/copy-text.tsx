import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#app/components/ui/button'

interface CopyTextProps {
	children: string
	className?: string
	text?: string // Optional prop for custom text to copy
}

export function CopyText({ children, text, className = '' }: CopyTextProps) {
	const [copied, setCopied] = useState(false)

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(text || children)
			setCopied(true)

			// Reset the copied state after 2 seconds
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy to clipboard:', err)
		}
	}

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<span className="font-mono text-sm">{children}</span>
			<Button
				variant="ghost"
				size="icon"
				className="hover:bg-muted h-6 w-6"
				onClick={copyToClipboard}
				aria-label="Copy to clipboard"
			>
				{copied ? (
					<Check className="h-3 w-3 text-green-600" />
				) : (
					<Copy className="h-3 w-3" />
				)}
			</Button>
		</div>
	)
}
