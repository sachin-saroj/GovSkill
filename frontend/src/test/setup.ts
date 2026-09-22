import '@testing-library/jest-dom/vitest';
import { vi, expect } from 'vitest';
import * as matchers from 'jest-axe';

const toHaveNoViolations =
  matchers.toHaveNoViolations || (matchers as any).default?.toHaveNoViolations;
if (toHaveNoViolations) {
  expect.extend(toHaveNoViolations);
}

declare module 'vitest' {
  export interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
  export interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn() as any;
}
