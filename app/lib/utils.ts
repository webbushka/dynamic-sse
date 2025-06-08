import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function parseJsonArray(input: string): any[] {
	try {
		const result = JSON.parse(input)
		return Array.isArray(result) ? result : []
	} catch {
		return []
	}
}
