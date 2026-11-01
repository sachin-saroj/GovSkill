import { isAxiosError } from 'axios';

interface ErrorBody {
  detail?: string | { error?: { message?: string }; message?: string };
  error?: { message?: string };
  message?: string;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError<ErrorBody>(error)) {
    return fallback;
  }

  // Handle network timeouts (e.g. cold starts or slow network)
  if (
    error.code === 'ECONNABORTED' ||
    (typeof error.message === 'string' && error.message.toLowerCase().includes('timeout'))
  ) {
    return 'The server took too long to respond. It may be waking up from cold sleep — please wait a moment and try again.';
  }

  // Handle network unreachable / server down
  if (
    error.code === 'ERR_NETWORK' ||
    (typeof error.message === 'string' && error.message.toLowerCase().includes('network error'))
  ) {
    return 'Unable to reach the server. Please verify your connection or ensure the backend service is running.';
  }

  const body = error.response?.data;
  if (!body) {
    return error.message || fallback;
  }

  if (typeof body.detail === 'string') {
    return body.detail;
  }

  return (
    body.detail?.error?.message ||
    body.detail?.message ||
    body.error?.message ||
    body.message ||
    fallback
  );
}
