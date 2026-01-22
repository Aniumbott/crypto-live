export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly recoverable: boolean = true,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', true, context);
    this.name = 'NetworkError';
  }
}

export class APIError extends AppError {
  constructor(
    message: string,
    public readonly statusCode: number,
    context?: Record<string, unknown>
  ) {
    super(message, 'API_ERROR', statusCode < 500, context);
    this.name = 'APIError';
  }
}

export class WebSocketError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'WEBSOCKET_ERROR', true, context);
    this.name = 'WebSocketError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
