interface Window {
  ethereum?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: <T>(args: { method: string; params?: any[] }) => Promise<T>;
  };
}
