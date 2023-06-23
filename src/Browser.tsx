import { Writable } from 'react-use-svelte-store';
import Container from './Container';
import Pagination from './Pagination';
import { FilterShape, ListBrowserShape, ListBrowserText } from './types';
import Header from './Header';
import { ListBrowserContext } from './context';

type BrowserProps<
  TData extends object,
  TFilters extends object,
  TItemComponentProps extends object,
  TStore extends ListBrowserShape<TData, TFilters>
> = {
  store: Writable<TStore>;
  filters?: FilterShape<TFilters>[];
  ItemComponent: (props: { data: TData }) => JSX.Element;
  itemComponentProps: TItemComponentProps;
  textResolver: (tooltip: ListBrowserText) => string;
  FiltersComponent?: () => JSX.Element;
  EmptyListComponent?: () => JSX.Element;
  SubheadingComponent?: () => JSX.Element;
  showHeader?: boolean;
};

const Browser = <
  TData extends object,
  TFilters extends object,
  TItemComponentProps extends object = {},
  TStore extends ListBrowserShape<TData, TFilters> = ListBrowserShape<TData, TFilters>
>({
  store,
  filters,
  ItemComponent,
  itemComponentProps,
  textResolver = () => '',
  FiltersComponent,
  EmptyListComponent,
  SubheadingComponent,
  showHeader = true
}: BrowserProps<TData, TFilters, TItemComponentProps, TStore>) => {
  return (
    <ListBrowserContext.Provider value={{ textResolver }}>
      {showHeader && (
        <Header<TData, TFilters, TStore> store={store} filters={filters} FiltersComponent={FiltersComponent} />
      )}
      {SubheadingComponent && <SubheadingComponent />}
      <Container
        store={store}
        ItemComponent={ItemComponent}
        itemComponentProps={itemComponentProps}
        EmptyListComponent={EmptyListComponent}
      />
      <Pagination<TData, TFilters, TStore> store={store} />
    </ListBrowserContext.Provider>
  );
};

export default Browser;
