import { ReactNode } from 'react';

export type SelectOption = {
  value: any;
  label: string;
};

export type FilterShape<TFilters extends object> = {
  name: Extract<keyof TFilters, string>;
  label: string;
  type: 'text' | 'number' | 'checkbox' | 'select';
  options?: SelectOption[];
};

export type ListResponseSimple<TData> = (TData & { __typename: string })[];

export type ListResponseDetails<TData> = {
  total: number;
  values: ListResponseSimple<TData>;
};

export type ListResponse<TData> = {
  [key: string]: ListResponseSimple<TData> | ListResponseDetails<TData>;
};

// #region List browser types

export type ListBrowserPager<TData> = {
  page: number;
  size: number;
  orderBy: keyof TData | null;
  direction: 'asc' | 'desc';
};

export type ListBrowserFilters<T extends object> = T & {
  search: string;
};

export type ListBrowserAction = {
  name: string;
  visible: boolean;
  component: ReactNode;
};

type ListBrowserOrderByField<TData> = {
  value: keyof TData;
  label: string;
};

export type ListBrowserOptions<TData, TFilters extends object> = {
  pager?: Partial<ListBrowserPager<TData>>;
  orderByFields?: ListBrowserOrderByField<TData>[];
  rowsPerPageOptions?: number[];
  filters: TFilters & {
    search?: string;
  };
  actions?: ListBrowserAction[];
};

export class ListBrowserShape<TData, TFilters extends object> {
  data: TData[];
  loading: boolean;
  total: number;
  pager: ListBrowserPager<TData>;
  orderByFields: ListBrowserOrderByField<TData>[];
  rowsPerPageOptions: number[];
  initialFilters: ListBrowserFilters<TFilters>;
  filters: ListBrowserFilters<TFilters>;
  actions: ListBrowserAction[];

  constructor(options: ListBrowserOptions<TData, TFilters>) {
    this.data = [];
    this.loading = false;
    this.total = 0;
    this.pager = {
      page: 1,
      size: 10,
      orderBy: null,
      direction: 'desc',
      ...options?.pager
    };
    this.orderByFields = options?.orderByFields || [];
    this.rowsPerPageOptions = options?.rowsPerPageOptions || [10, 25, 50, 100];
    this.initialFilters = { search: '', ...options.filters };
    this.filters = { search: '', ...options.filters };
    this.actions = options?.actions || [];
  }
}

// #endregion

export enum ListBrowserText {
  NoEntries = 'NoEntries',
  Search = 'Search',
  OrderBy = 'OrderBy',
  Direction = 'Direction',
  Ascending = 'Ascending',
  Descending = 'Descending'
}
