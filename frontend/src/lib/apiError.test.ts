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

  it('uses the fallback for unknown errors', () => {
    expect(getApiErrorMessage(new Error('Unexpected failure'), 'Fallback')).toBe('Fallback');
  });
});