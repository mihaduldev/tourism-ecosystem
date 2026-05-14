"use client";

import { useMemo } from "react";

interface FilterConfig {
  field: string;
  value: string;
}

export function useFilteredData<T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  searchFields: string[],
  filters: FilterConfig[] = [],
): T[] {
  return useMemo(() => {
    let result = data;

    // Apply search
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(lower);
        })
      );
    }

    // Apply filters
    for (const filter of filters) {
      if (filter.value) {
        result = result.filter((item) => String(item[filter.field]) === filter.value);
      }
    }

    return result;
  }, [data, searchTerm, searchFields, filters]);
}
