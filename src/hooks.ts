import { useCallback } from 'react';
import { useWritable, Writable } from 'react-use-svelte-store';
import cloneDeep from 'lodash.clonedeep';
import { setNestedProperty, sort } from './functions';
import { ListBrowserAction, ListBrowserShape } from './types';

const useUtils = <TData extends object, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>>(
  store: Writable<TStore>
) => {
  const [$store, set, update] = useWritable(store);

  const updatePath = useCallback(
    (path: string, withPageReset = false) =>
      (value: any) => {
        update(prev => {
          const newValue = cloneDeep(prev);
          setNestedProperty(newValue, path, value);
          if (withPageReset) newValue.pager.page = 1;
          return newValue;
        });
      },
    [update]
  );

  const updateActions = useCallback(
    (actions: ListBrowserAction[]) =>
      update(prev => {
        const newActions = actions.filter(action => !prev.actions.some(({ name }) => name === action.name));
        const allActions = [
          ...prev.actions.map(action => actions.find(({ name }) => name === action.name) ?? action),
          ...newActions
        ];
        sort(allActions, 'name');
        return {
          ...prev,
          actions: allActions
        };
      }),
    [update]
  );

  return {
    $store,
    set,
    update,
    updatePath,
    updateActions
  };
};

export default useUtils;
