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

};

export { reportError };
