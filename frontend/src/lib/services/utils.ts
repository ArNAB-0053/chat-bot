export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readString(value: unknown, label: string): string {
	if (typeof value !== 'string' || !value.trim()) {
		throw new Error(`Invalid ${label}`);
	}

	return value.trim();
}

export function readOptionalString(value: unknown): string | undefined {
	if (value === undefined || value === null) {
		return undefined;
	}

	if (typeof value !== 'string') {
		throw new Error('Invalid string value');
	}

	const trimmedValue = value.trim();

	return trimmedValue || undefined;
}

export function readArray<T>(value: unknown, label: string, mapItem: (item: unknown) => T): T[] {
	if (!Array.isArray(value)) {
		throw new Error(`Invalid ${label}`);
	}

	return value.map(mapItem);
}
