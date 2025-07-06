export class TokenMissingError extends Error {
  constructor(message: string = "Access token is missing from cookies") {
    super(message);
    this.name = "TokenMissingError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TokenMissingError);
    }
  }
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as any).message === "string"
  ) {
    return (err as any).message;
  }

  if (typeof err === "string") {
    return err;
  }

  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}