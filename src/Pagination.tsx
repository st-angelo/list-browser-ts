import { useReadable, Writable } from 'react-use-svelte-store';
import { Pagination as PaginationComponent } from '@totalsoft/rocket-ui';
import { ListBrowserShape } from './types';
import useUtils from './hooks';

type PaginationProps<
  TData extends object,
  TFilters extends object,
  TStore extends ListBrowserShape<TData, TFilters>
> = {
  store: Writable<TStore>;
};

const Pagination = <TData extends object, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>>({
  store
}: PaginationProps<TData, TFilters, TStore>) => {
  const $store = useReadable(store);
  const { updatePath } = useUtils<TData, TFilters, TStore>(store);

  return (
    <PaginationComponent
      loading={$store.loading}
      page={$store.pager.page - 1}
      pageSize={$store.pager.size}
      count={$store.total}
      onPageChange={page => updatePath('pager.page')(page + 1)}
      onRowsPerPageChange={updatePath('pager.size')}
      //onRefresh={$store.refetch}
      rowsPerPageOptions={$store.rowsPerPageOptions}
    />
  );
};

export default Pagination;
