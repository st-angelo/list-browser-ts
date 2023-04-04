import { useReadable, Writable } from 'react-use-svelte-store';
import { ListBrowserShape } from './metadata';
import useUtils from './hooks/useUtils';
import PaginationComponent from './temp/components/pagination/Pagination';

type PaginationProps<
  TData extends object,
  TFilters extends object,
  TStore extends ListBrowserShape<TData, TFilters>
> = {
  store: Writable<TStore>;
};

const Pagination = <TData extends object, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>>({
  store: _store
}: PaginationProps<TData, TFilters, TStore>) => {
  const store = useReadable(_store);
  const { updateStore } = useUtils<TData, TFilters, TStore>(_store);

  return (
    <PaginationComponent
      loading={store.loading}
      page={store.pager.page}
      pageSize={store.pager.size}
      totalCount={store.total}
      onChangePage={updateStore('pager.page')}
      onChangeRowsPerPage={updateStore('pager.size')}
      onRefresh={store.refetch}
      rowsPerPageOptions={store.rowsPerPageOptions}
    />
  );
};

export default Pagination;
