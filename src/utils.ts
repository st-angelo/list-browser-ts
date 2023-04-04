import { writable } from 'react-use-svelte-store';
import { Mixin } from 'ts-mixer';
import { ListBrowserOptions, ListBrowserShape } from './metadata';

export function getStore<TData, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>>(
  shape: TStore
) {
  return writable(shape);
}

export function getDefaultStore<TData, TFilters extends object>(options: ListBrowserOptions<TData, TFilters>) {
  return writable(new ListBrowserShape<TData, TFilters>(options));
}

export const extender = Mixin;
