import { ReactNode } from 'react';
import i18next from 'i18next';
import { DocumentNode, OperationVariables, QueryHookOptions, TypedDocumentNode } from '@apollo/client';

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

export type QueryData<TData = any, TVariables extends OperationVariables = OperationVariables> = {
  name: string;
  query: DocumentNode | TypedDocumentNode<TData, TVariables>;
  options?: QueryHookOptions<TData, TVariables>;
};

export type ClientFilter<TData, TFilters extends object> = (
  data: TData[],
  filters: ListBrowserFilters<TFilters>
) => TData[];

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
  basic?: boolean;
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
  filters: ListBrowserFilters<TFilters>;
  actions: ListBrowserAction[];
  dirty: boolean;

  initialFilters: ListBrowserFilters<TFilters>;

  refetch: (variables?: Partial<OperationVariables>) => any;

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
    this.filters = { search: '', ...options.filters };
    this.actions = options?.actions || [];
    this.dirty = false;

    this.initialFilters = { search: '', ...options.filters };

    this.refetch = () => {};
  }
}

// #endregion

export const getDirectionOptions = () => [
  {
    value: 'asc' as const,
    label: i18next.t('General.Ascending')
  },
  {
    value: 'desc' as const,
    label: i18next.t('General.Descending')
  }
];
