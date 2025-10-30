import qs from "query-string";
import { PRODUCTS_PER_PAGE, MIN_PRICE, MAX_PRICE } from "@/lib/constants";

type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | boolean[];
type QueryObject = Record<string, QueryValue>;

export function parseQuery(search: string): QueryObject {
  const parsed = qs.parse(search, { arrayFormat: "bracket" });
  return parsed as QueryObject;
}

export function stringifyQuery(query: QueryObject): string {
  return qs.stringify(query, {
    skipNull: true,
    skipEmptyString: true,
    arrayFormat: "bracket",
  });
}

export function withUpdatedParams(
  pathname: string,
  currentSearch: string,
  updates: QueryObject
): string {
  const current = parseQuery(currentSearch);
  const next: QueryObject = { ...current };

  Object.entries(updates).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete next[key];
    } else {
      next[key] = value as QueryValue;
    }
  });

  const search = stringifyQuery(next);
  return search ? `${pathname}?${search}` : pathname;
}

export function toggleArrayParam(
  pathname: string,
  currentSearch: string,
  key: string,
  value: string
): string {
  const current = parseQuery(currentSearch);
  const arr = new Set<string>(
    Array.isArray(current[key])
      ? (current[key] as string[])
      : current[key]
      ? [String(current[key])]
      : []
  );
  if (arr.has(value)) {
    arr.delete(value);
  } else {
    arr.add(value);
  }
  const nextValues = Array.from(arr);
  const updates: QueryObject = {
    [key]: nextValues.length ? nextValues : undefined,
  };
  return withUpdatedParams(pathname, currentSearch, updates);
}

export function setParam(
  pathname: string,
  currentSearch: string,
  key: string,
  value: string | number | null | undefined
): string {
  return withUpdatedParams(pathname, currentSearch, {
    [key]: value === null || value === undefined ? undefined : String(value),
  });
}

export function removeParams(
  pathname: string,
  currentSearch: string,
  keys: string[]
): string {
  const current = parseQuery(currentSearch);
  keys.forEach((k) => delete current[k]);
  const search = stringifyQuery(current);
  return search ? `${pathname}?${search}` : pathname;
}

export function getArrayParam(search: string, key: string): string[] {
  const q = parseQuery(search);
  const v = q[key];
  if (Array.isArray(v)) return v.map(String);
  if (v === undefined) return [];
  return [String(v)];
}

export function getStringParam(
  search: string,
  key: string
): string | undefined {
  const q = parseQuery(search);
  const v = q[key];
  if (v === undefined) return undefined;
  return Array.isArray(v) ? (v[0] ? String(v[0]) : undefined) : String(v);
}

/* New helpers for products */

export type NormalizedProductFilters = {
  search?: string;
  genderSlugs: string[];
  sizeSlugs: string[];
  colorSlugs: string[];
  brandSlugs: string[];
  categorySlugs: string[];
  priceMin?: number;
  priceMax?: number;
  priceRanges: Array<[number | undefined, number | undefined]>;
  sort: "featured" | "newest" | "price_asc" | "price_desc";
  page: number;
  limit: number;
};

export function parseFilterParams(
  sp: Record<string, string | string[] | undefined>
): NormalizedProductFilters {
  const getArr = (k: string) => {
    const v1 = sp[k];
    const v2 = sp[`${k}[]`];
    const arr1 = Array.isArray(v1)
      ? v1.map(String)
      : v1 === undefined
      ? []
      : [String(v1)];
    const arr2 = Array.isArray(v2)
      ? (v2 as string[]).map(String)
      : v2 === undefined
      ? []
      : [String(v2 as string)];
    return [...arr1, ...arr2].filter(Boolean); // Remove empty strings
  };

  const getStr = (k: string) => {
    const v = sp[k] ?? sp[`${k}[]`];
    if (v === undefined) return undefined;
    const result = Array.isArray(v)
      ? v[0]
        ? String(v[0])
        : undefined
      : String(v);
    return result && result.trim() ? result.trim() : undefined;
  };

  const search = getStr("search");

  const genderSlugs = getArr("gender").map((s) => s.toLowerCase());
  const sizeSlugs = getArr("size").map((s) => s.toLowerCase());
  const colorSlugs = getArr("color").map((s) => s.toLowerCase());
  const brandSlugs = getArr("brand").map((s) => s.toLowerCase());
  const categorySlugs = getArr("category").map((s) => s.toLowerCase());

  const priceRangesStr = getArr("price");
  const priceRanges: Array<[number | undefined, number | undefined]> =
    priceRangesStr
      .map((r) => {
        const [minStr, maxStr] = String(r).split("-");
        const min = minStr && minStr.trim() ? Number(minStr.trim()) : undefined;
        const max = maxStr && maxStr.trim() ? Number(maxStr.trim()) : undefined;
        return [
          Number.isNaN(min as number) ? undefined : min,
          Number.isNaN(max as number) ? undefined : max,
        ] as [number | undefined, number | undefined];
      })
      .filter(([min, max]) => min !== undefined || max !== undefined); // Only keep valid ranges

  const priceMinStr = getStr("priceMin");
  const priceMaxStr = getStr("priceMax");
  const priceMin = priceMinStr ? Number(priceMinStr) : undefined;
  const priceMax = priceMaxStr ? Number(priceMaxStr) : undefined;

  const sortParam = getStr("sort");
  const sort: NormalizedProductFilters["sort"] =
    sortParam === "price_asc" ||
    sortParam === "price_desc" ||
    sortParam === "newest" ||
    sortParam === "featured"
      ? sortParam
      : "featured"; // Changed default to "featured"

  const pageStr = getStr("page");
  const page = Math.max(1, Number(pageStr) || 1);

  // Parse pagination parameters
  const limitStr = getStr("limit");
  const limitRaw = Number(limitStr) || PRODUCTS_PER_PAGE;
  // Ensure limit is between 1 and MAX_PRICE
  // Using MAX_PRICE as an upper bound for pagination to prevent performance issues
  const limit = Math.max(1, Math.min(limitRaw, MAX_PRICE));

  return {
    search,
    genderSlugs,
    sizeSlugs,
    colorSlugs,
    brandSlugs,
    categorySlugs,
    priceMin:
      priceMin !== undefined && !Number.isNaN(priceMin) ? priceMin : undefined,
    priceMax:
      priceMax !== undefined && !Number.isNaN(priceMax) ? priceMax : undefined,
    priceRanges,
    sort,
    page,
    limit,
  };
}

export function buildProductQueryObject(
  filters: NormalizedProductFilters
): QueryObject {
  const query: QueryObject = {};

  if (filters.search) query.search = filters.search;
  if (filters.genderSlugs.length) query.gender = filters.genderSlugs;
  if (filters.sizeSlugs.length) query.size = filters.sizeSlugs;
  if (filters.colorSlugs.length) query.color = filters.colorSlugs;
  if (filters.brandSlugs.length) query.brand = filters.brandSlugs;
  if (filters.categorySlugs.length) query.category = filters.categorySlugs;
  if (filters.priceMin !== undefined) query.priceMin = filters.priceMin;
  if (filters.priceMax !== undefined) query.priceMax = filters.priceMax;
  if (filters.priceRanges.length) {
    query.price = filters.priceRanges
      .map(([min, max]) =>
        min !== undefined && max !== undefined
          ? `${min}-${max}`
          : min !== undefined
          ? `${min}-`
          : max !== undefined
          ? `-${max}`
          : ""
      )
      .filter(Boolean);
  }
  if (filters.sort !== "featured") query.sort = filters.sort;
  if (filters.page > 1) query.page = filters.page;
  if (filters.limit !== 24) query.limit = filters.limit;

  return query;
}

export function toggleArrayValue(
  currentSearch: string,
  key: string,
  value: string
): string {
  const current = parseQuery(currentSearch);
  const existing = current[key];

  const asArray = Array.isArray(existing)
    ? (existing as string[])
    : existing
    ? String(existing).split(",")
    : [];

  const index = asArray.indexOf(value);
  if (index >= 0) {
    asArray.splice(index, 1);
  } else {
    asArray.push(value);
  }

  const next: Record<string, QueryValue | undefined> = { ...current };
  if (asArray.length === 0) {
    delete next[key];
  } else {
    next[key] = asArray as unknown as QueryValue;
  }

  return stringifyQuery(next as QueryObject);
}
