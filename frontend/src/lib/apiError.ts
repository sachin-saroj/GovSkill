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