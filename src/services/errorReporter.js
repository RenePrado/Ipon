const reportError = (source, error, context = {}) => {
  const entry = {
    source,
    message: error?.message || String(error),
    stack: error?.stack,
    timestamp: new Date().toISOString(),
    ...context,
  };

  console.error(`[${entry.source}] ${entry.message}`, {
    ...entry,
    ...(error ? { error } : {}),
  });

  // Future: send to Sentry, LogRocket, etc.
  // if (window.Sentry) window.Sentry.captureException(error, { contexts: { app: entry } });
};

export { reportError };
