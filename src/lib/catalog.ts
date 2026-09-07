import type { Product } from '@/types/product';

declare const require: (id: string) => unknown;

let cache: Product[] | null = null;

/**
 * The catalogue is a 3.1 MB JSON blob. Requiring it from inside a function keeps Metro from
 * evaluating it during start-up, so it costs nothing until a plan is actually generated, and the
 * result is held afterwards so the parse happens at most once per session.
 */
export function getCatalog(): Product[] {
  cache ??= require('../constants/product_catalog_en.json') as Product[];
  return cache;
}
