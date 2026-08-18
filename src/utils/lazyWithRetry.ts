import React, { lazy } from 'react';

/**
 * Enterprise-grade dynamic component loader with automated retry & version-mismatch recovery.
 *
 * If a chunk fails to load (e.g. because a new version was deployed and the old chunk hash returns 404,
 * or due to a temporary mobile connection drop when waking from background), this automatically
 * performs a clean recovery reload so the user never experiences a broken or frozen screen.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T } | { [key: string]: T }>,
  namedExport?: string
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    const hasAlreadyForceRefreshed = window.sessionStorage.getItem('chunk_retry_timestamp');
    const now = Date.now();

    try {
      const module = await componentImport();
      // If import succeeds, clear any old retry flag
      if (hasAlreadyForceRefreshed && (now - Number(hasAlreadyForceRefreshed) > 10000)) {
        window.sessionStorage.removeItem('chunk_retry_timestamp');
      }

      if (namedExport && namedExport in module) {
        return { default: (module as Record<string, T>)[namedExport] };
      }
      return module as { default: T };
    } catch (error: any) {
      console.warn('[AutoRecovery] Chunk load failed. Checking for stale build...', error);

      // Check if we haven't retried in the last 15 seconds to avoid infinite reload loops
      const canRetry = !hasAlreadyForceRefreshed || (now - Number(hasAlreadyForceRefreshed) > 15000);

      if (canRetry) {
        window.sessionStorage.setItem('chunk_retry_timestamp', String(now));
        // Perform a clean reload from the server
        window.location.reload();
        // Return a temporary blank component while the browser reloads
        return { default: (() => null) as unknown as T };
      }

      // If already retried and still failing, throw so ErrorBoundary can handle it
      throw error;
    }
  });
}
