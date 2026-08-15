import { useState, useEffect } from "react";

export function useSlowLoading(isLoading, delay = 5000) {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsSlow(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSlow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return isSlow;
}
