import { InjectionToken } from '@angular/core';

/**
 * PUBLIC_INTERFACE
 * Provides strongly-typed access to environment variables prefixed with NG_APP_*.
 */
export interface AppEnvironment {
  apiBase?: string;
  backendUrl?: string;
  wsUrl?: string;
  nodeEnv?: string;
  featureFlags?: string;
  experimentsEnabled?: string;
}

/**
 * PUBLIC_INTERFACE
 * Injection token for the environment configuration.
 */
export const ENV_CONFIG = new InjectionToken<AppEnvironment>('ENV_CONFIG');

/**
 * Attempts to read NG_APP_* variables exposed by the host environment.
 * In Angular CLI setups, process.env is not directly available in the browser bundle.
 * We read from global window if present (SSR-safe checks) and allow undefineds.
 */
export function getEnvironment(): AppEnvironment {
  const w: any = (typeof globalThis !== 'undefined' && (globalThis as any).window) ? (globalThis as any).window : {};
  const env: AppEnvironment = {
    apiBase: w?.NG_APP_API_BASE ?? undefined,
    backendUrl: w?.NG_APP_BACKEND_URL ?? undefined,
    wsUrl: w?.NG_APP_WS_URL ?? undefined,
    nodeEnv: w?.NG_APP_NODE_ENV ?? undefined,
    featureFlags: w?.NG_APP_FEATURE_FLAGS ?? undefined,
    experimentsEnabled: w?.NG_APP_EXPERIMENTS_ENABLED ?? undefined,
  };
  return env;
}

/**
 * PUBLIC_INTERFACE
 * Helper to decide whether to use mock API based on environment config presence.
 */
export function shouldUseMock(env: AppEnvironment): boolean {
  // If no API base or backend URL is configured, default to mock mode.
  return !(env.apiBase || env.backendUrl);
}
