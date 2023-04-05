import { useCallback } from 'react';
import { useWritable, Writable } from 'react-use-svelte-store';
import { setNestedProperty } from '../functions';
import { ListBrowserAction, ListBrowserShape } from '../metadata';

const useUtils = <TData extends object, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>>(
  _store: Writable<TStore>
) => {
  const [store, set, update] = useWritable(_store);

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

  const addOrUpdateActions = useCallback(
    (actions: ListBrowserAction[]) =>
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
    [update]
  );

  return {
    store,
    set,
    update,
    updateStore,
    addOrUpdateActions
  };
};

export default useUtils;
