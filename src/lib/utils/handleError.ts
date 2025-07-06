import { getErrorMessage, TokenMissingError } from "@/lib/errors";
import { toast } from "sonner";
import { useLogout } from "../logout";

export function useHandleErrorWithToast() {
  const logout = useLogout();

  return function handleErrorWithToast(
    error: unknown,
    options?: {
      onUnhandledError?: () => void;
    }
  ) {
    const message = getErrorMessage(error);
    toast.error(message);

    if (error instanceof TokenMissingError) {
      logout();
      return;
    }

    if (options?.onUnhandledError) {
      options.onUnhandledError();
    }
  };
}