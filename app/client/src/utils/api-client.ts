const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

type ApiEnvelope<T> = {
  data: T | null;
  error: { code: string; message: string; details?: unknown; requestId: string } | null;
};

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const envelope = contentType.includes('application/json')
    ? ((await response.json()) as ApiEnvelope<T>)
    : ({ data: null, error: { code: 'INTERNAL', message: await response.text(), requestId: 'unknown' } } as ApiEnvelope<T>);

  if (!response.ok || envelope.error) {
    throw new Error(envelope.error?.message ?? 'API request failed');
  }

  return envelope.data as T;
}
