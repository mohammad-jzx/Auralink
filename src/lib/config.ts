export const GAS_EXEC_URL = import.meta.env.VITE_GAS_EXEC_URL as string;
if (!GAS_EXEC_URL) {
  // لوج تحذيري فقط أثناء التطوير
  console.warn('[Auralink] VITE_GAS_EXEC_URL is NOT defined');
}


