import { Writable } from 'react-use-svelte-store';
import Container from './Container';
import Pagination from './Pagination';
import { ClientFilter, FilterShape, ListBrowserShape, QueryData } from './metadata';
import Header from './Header';

type BrowserProps<TData extends object, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>> = {
  store: Writable<TStore>;
  queryData: QueryData;
  filters?: FilterShape<TFilters>[];
  ItemComponent: (props: { data: any }) => JSX.Element;
  FiltersComponent?: () => JSX.Element;
  EmptyListComponent?: () => JSX.Element;
  SubheadingComponent?: () => JSX.Element;
  showHeader?: boolean;
  clientFilter?: ClientFilter<TData, TFilters>;
};

const Browser = <TData extends object, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>>({
  store,
  queryData,
  filters,
  ItemComponent,
  FiltersComponent,
  EmptyListComponent,
  SubheadingComponent,
  showHeader = true,
  clientFilter
}: BrowserProps<TData, TFilters, TStore>) => {
  return (
    <>
      {showHeader && (
        <Header<TData, TFilters, TStore> store={store} filters={filters} FiltersComponent={FiltersComponent} />
      )}
      {SubheadingComponent && <SubheadingComponent />}
      <Container
        store={store}
        queryData={queryData}
        ItemComponent={ItemComponent}
        EmptyListComponent={EmptyListComponent}
        clientFilter={clientFilter}
      />
      <Pagination<TData, TFilters, TStore> store={store} />
    </>
  );
};

export default Browser;
