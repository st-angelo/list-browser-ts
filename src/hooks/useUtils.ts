import { useCallback, useEffect } from 'react';
import { useWritable, Writable } from 'react-use-svelte-store';
import { setNestedProperty } from '../functions';
import { ListBrowserAction, ListBrowserShape } from '../metadata';

const useActions = <TData extends object, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>>(
  store: Writable<TStore>,
  actions: ListBrowserAction[]
) => {
  const [, , update] = useWritable(store);

  const addOrReplaceActions = useCallback(
    () =>
      update(prev => {
        const newActions = actions.filter(action => !prev.actions.some(({ name }) => name === action.name));
        return {
          ...prev,
          actions: [
            ...prev.actions.map(action => actions.find(({ name }) => name === action.name) ?? action),
            ...newActions
          ]
        };
      }),
    [actions, update]
  );

  useEffect(() => {
    addOrReplaceActions();
  }, [addOrReplaceActions]);
};

const useUtils = <TData extends object, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>>(
  store: Writable<TStore>
) => {
  const [$store, set, update] = useWritable(store);

  const updateStore = useCallback(
    (path: string) => (value: any) => {
      update(prev => {
        const newValue = { ...prev, filters: { ...prev.filters }, pager: { ...prev.pager, page: 1 } };
        setNestedProperty(newValue, path, value);
        return newValue;
      });
    },
    [update]
  );

  return {
    $store,
    set,
    update,
    updateStore,
    useActions: (actions: ListBrowserAction[]) => useActions<TData, TFilters, TStore>(store, actions)
  };
};

export default useUtils;
