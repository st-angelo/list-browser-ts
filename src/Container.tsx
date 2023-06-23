import { useReadable, Writable } from 'react-use-svelte-store';
import { FakeText } from '@totalsoft/rocket-ui';
import { ListBrowserShape, ListBrowserText } from './types';
import { useContext } from 'react';
import { ListBrowserContext } from './context';

type ContainerProps<
  TData extends object,
  TFilters extends object,
  TItemComponentProps extends object,
  TStore extends ListBrowserShape<TData, TFilters>
> = {
  store: Writable<TStore>;
  keyProperty?: keyof TData | 'id' | null;
  ItemComponent: (props: TItemComponentProps & { data: TData }) => JSX.Element;
  itemComponentProps: TItemComponentProps;
  EmptyListComponent?: () => JSX.Element;
};

const Container = <
  TData extends object,
  TFilters extends object,
  TItemComponentProps extends object = {},
  TStore extends ListBrowserShape<TData, TFilters> = ListBrowserShape<TData, TFilters>
>({
  store,
  keyProperty = 'id',
  ItemComponent,
  itemComponentProps,
  EmptyListComponent
}: ContainerProps<TData, TFilters, TItemComponentProps, TStore>) => {
  const { data, loading } = useReadable(store);
  const { textResolver } = useContext(ListBrowserContext);

  return (
    <div style={{ marginBlock: '1rem' }}>
      {loading && <FakeText lines={6} onPaper />}
      {!loading && (
        <>
          {data.length === 0 && EmptyListComponent && <EmptyListComponent />}
          {data.length === 0 && !EmptyListComponent && <span>{textResolver(ListBrowserText.NoEntries)}</span>}
          {data.length > 0 && (
            <>
              {data.map(item => (
                <ItemComponent
                  {...itemComponentProps}
                  data={item}
                  key={String(
                    (keyProperty === 'id'
                      ? item && typeof item === 'object' && 'id' in item && item[keyProperty]
                      : keyProperty !== null
                      ? item[keyProperty]
                      : null) || crypto.randomUUID()
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
