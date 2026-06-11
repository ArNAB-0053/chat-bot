import type { ApiResponse } from '$lib/types/api';

export interface HealthData {
	status: 'ok';
}

export async function getHealth(): Promise<HealthData> {
	const response = await fetch('/health', {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const payload = (await response.json()) as ApiResponse<HealthData> | { message?: string };

	if (!response.ok) {
		const message = typeof payload === 'object' && payload && 'message' in payload ? payload.message : 'Unable to connect to server.';
		throw new Error(message || 'Unable to connect to server.');
	}

	return (payload as ApiResponse<HealthData>).data;
}
