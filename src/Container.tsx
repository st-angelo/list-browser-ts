import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWritable, Writable } from 'react-use-svelte-store';
import {
  ListResponse,
  ListBrowserShape,
  QueryData,
  ListResponseDetails,
  ClientFilter,
  ListResponseSimple
} from './metadata';
import { useQuery } from '@apollo/client';
import LoadingFakeText from './temp/components/loadingFakeText/LoadingFakeText';
import { removeApolloTypename, sort } from './functions';

type ContainerProps<
  TData extends object,
  TFilters extends object,
  TStore extends ListBrowserShape<TData, TFilters>,
  TItemComponentProps extends object
> = {
  store: Writable<TStore>;
  queryData: QueryData;
  keyProperty?: keyof TData | 'id';
  ItemComponent: (props: TItemComponentProps & { data: TData }) => JSX.Element;
  itemComponentProps: TItemComponentProps;
  EmptyListComponent?: () => JSX.Element;
  clientFilter?: ClientFilter<TData, TFilters>;
};

const Container = <
  TData extends object,
  TFilters extends object,
  TStore extends ListBrowserShape<TData, TFilters> = ListBrowserShape<TData, TFilters>,
  TItemComponentProps extends object = {}
>({
  store,
  queryData,
  keyProperty = 'id',
  ItemComponent,
  itemComponentProps,
  EmptyListComponent,
  clientFilter
}: ContainerProps<TData, TFilters, TStore, TItemComponentProps>) => {
  const { t } = useTranslation();
  const [{ data: storeData, filters, pager }, , update] = useWritable(store);

  // If clientFilter function is defined, all the filtering and pagination will be handled on the client, and the list
  // will be fetched without the pager and filter variables, thus returning all records (which the query must support!)
  const clientBrowsing = useMemo(() => Boolean(clientFilter), [clientFilter]);

  const variables = useMemo(() => {
    const value = { ...queryData.options?.variables };
    if (clientBrowsing) return value;
    return { ...value, filters, pager };
  }, [clientBrowsing, queryData, filters, pager]);

  const { loading, refetch } = useQuery<ListResponse<TData>>(queryData.query, {
    ...queryData.options,
    onCompleted: data => {
      let values: TData[];
      let total: number;
      if (clientBrowsing) {
        const fromQuery = data?.[queryData.name] as ListResponseSimple<TData>;
        values = removeApolloTypename(fromQuery);
        total = values.length;
      } else {
        const fromQuery = data?.[queryData.name] as ListResponseDetails<TData>;
        values = removeApolloTypename(fromQuery?.values);
        total = fromQuery?.total || 0;
      }
      update(prev => ({ ...prev, data: values, total, dirty: false }));
      if (queryData.options?.onCompleted) queryData.options.onCompleted(data);
    },
    variables
  });

  const data = useMemo(() => {
    if (!clientBrowsing) return storeData; // Data already paginated and filtered on the server
    // Apply client filtering function
    const filteredData = (clientFilter && clientFilter(storeData, filters)) || storeData;
    // Apply sorting
    if (pager.orderBy) sort(filteredData, pager.orderBy, pager.direction);
    // Update total
    update(prev => ({ ...prev, total: filteredData.length }));
    // Apply pagination
    return filteredData.slice((pager.page - 1) * pager.size, (pager.page - 1) * pager.size + pager.size);
  }, [clientBrowsing, clientFilter, pager, filters, storeData, update]);

  //#region Side Effects

  useEffect(() => update(prev => ({ ...prev, loading, refetch })), [loading, update, refetch]);

  //#endregion

  return (
    <div style={{ marginBlock: '1rem' }}>
      {loading && <LoadingFakeText lines={6} onPaper />}
      {!loading && (
        <>
          {data.length === 0 && EmptyListComponent && <EmptyListComponent />}
          {data.length === 0 && !EmptyListComponent && <span>{t('Common.NoEntries')}</span>}
          {data.length > 0 && (
            <>
              {data.map(item => (
                <ItemComponent
                  {...itemComponentProps}
                  data={item}
                  key={String(
                    (keyProperty === 'id'
                      ? item && typeof item === 'object' && 'id' in item && item[keyProperty]
                      : item[keyProperty]) || crypto.randomUUID()
                  )}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Container;
