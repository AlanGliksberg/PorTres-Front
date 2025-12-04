let logoutHandler: (() => Promise<void> | void) | null = null;
let isLoggingOut = false;

export const setLogoutHandler = (
  handler: (() => Promise<void> | void) | null
) => {
  logoutHandler = handler;
};

export const triggerLogout = async () => {
  if (!logoutHandler || isLoggingOut) return;

  isLoggingOut = true;
  try {
    await logoutHandler();
  } catch (error) {
    console.log("Failed to trigger logout:", error);
  } finally {
    isLoggingOut = false;
  }
};
