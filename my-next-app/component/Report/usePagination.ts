
import { useEffect, useState } from "react";

const DEFAULT_LIMIT = 10;

export function usePagination(resetKeys: unknown[], limit: number = DEFAULT_LIMIT) {
  const [page, setPage] = useState(1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPage(1);
  }, resetKeys);

  const offset = (page - 1) * limit;

  return { page, setPage, limit, offset };
}