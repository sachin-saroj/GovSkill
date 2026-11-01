import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { getApiErrorMessage } from './apiError';

describe('getApiErrorMessage', () => {
  it('extracts the backend validation error format', () => {
    const error = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        data: { detail: { error: { message: 'Email already registered' } } },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: { headers: new AxiosHeaders() },
      },
    );

    expect(getApiErrorMessage(error, 'Fallback')).toBe('Email already registered');
  });

  it('provides a friendly message on timeout', () => {
    const timeoutError = new AxiosError(
      'timeout of 15000ms exceeded',
      'ECONNABORTED',
      undefined,
      undefined,
      undefined,
    );
    expect(getApiErrorMessage(timeoutError, 'Fallback')).toContain('waking up from cold sleep');
  });

  it('provides a friendly message on network error', () => {
    const networkError = new AxiosError(
      'Network Error',
      'ERR_NETWORK',
      undefined,
      undefined,
      undefined,
    );
    expect(getApiErrorMessage(networkError, 'Fallback')).toContain('Unable to reach the server');
  });

  it('uses the fallback for unknown errors', () => {
    expect(getApiErrorMessage(new Error('Unexpected failure'), 'Fallback')).toBe('Fallback');
  });
});
