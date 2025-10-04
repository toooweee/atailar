import { useState } from 'react';

export function useLoading() {
  const [loading, setLoading] = useState<boolean>(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

 const withLoading = async <T>(asyncFn: () => Promise<T>): Promise<T | undefined> => {
    try {
      startLoading();
      return await asyncFn();
    } finally {
      stopLoading();
    }
  };

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
  };
}
