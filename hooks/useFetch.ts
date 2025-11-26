"use client";

import { useEffect, useState } from "react";

export default function useFetch<T = null>(url: string) {
  const [data, setData] = useState<T | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, { signal });
        if (!res.ok) {
          setError(`Request failed with status ${res.status}`);
          return;
        }

        const data = await res.json();
        setData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url]);

  return {
    data,
    loading,
    error,
  };
}
