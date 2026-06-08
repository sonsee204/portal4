import { toast } from 'sonner';

/** Show a success toast */
export const showSuccess = (message: string) => toast.success(message);

/** Show an error toast */
export const showError = (message: string) => toast.error(message);

/** Show an informational toast */
export const showInfo = (message: string) => toast.info(message);

/** Show a warning toast */
export const showWarning = (message: string) => toast.warning(message);

export function showSuccessWithAction(
  message: string,
  action: { label: string; onClick: () => void },
  durationMs = 5000,
) {
  return toast.success(message, {
    duration: durationMs,
    action: {
      label: action.label,
      onClick: action.onClick,
    },
  });
}
