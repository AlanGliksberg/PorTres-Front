import { useEffect, useState } from "react";

import { getClubs } from "@/src/services/match";
import { Club } from "@/src/types";

export default function useClubs(enabled = true) {
  const [data, setData] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!enabled) return;

    setLoading(true);
    getClubs()
      .then((res) => {
        if (mounted) setData(res.data?.clubs || []);
      })
      .catch((err) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [enabled]);

  return { data, loading, error };
}
