const reportError = (source, error, context = {}) => {
  const entry = {
    source,
    message: error?.message || String(error),
    stack: error?.stack,
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${entry.source}] ${entry.message}`, {
      ...entry,
      ...(error ? { error } : {}),
    });
  }

};

export { reportError };
