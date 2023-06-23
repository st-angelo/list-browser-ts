import React, { useContext } from 'react';
import { Collapse, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { ArrowUpward, ArrowDownward, RotateLeft } from '@mui/icons-material';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useReadable, useWritable, Writable } from 'react-use-svelte-store';
import Action from './Action';
import useUtils from './hooks';
import { FilterShape, ListBrowserShape, ListBrowserText } from './types';
import { ListBrowserContext } from './context';
import { Autocomplete, TextField } from '@totalsoft/rocket-ui';

type HeaderProps<TData extends object, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>> = {
  store: Writable<TStore>;
  filters?: FilterShape<TFilters>[];
  FiltersComponent?: () => JSX.Element;
};

const Header = <TData extends object, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>>({
  store,
  filters,
  FiltersComponent
}: HeaderProps<TData, TFilters, TStore>) => {
  const [$store, , update] = useWritable(store);
  const { textResolver } = useContext(ListBrowserContext);

  const [showFilters, setShowFilters] = useState(false);

  const { updatePath, updateActions } = useUtils<TData, TFilters, TStore>(store);

  const hasActions = useMemo(() => $store.actions.length > 0, [$store.actions.length]);
  const directionOptions = useMemo(
    () => [
      {
        value: 'asc' as const,
        label: textResolver(ListBrowserText.Ascending)
      },
      {
        value: 'desc' as const,
        label: textResolver(ListBrowserText.Descending)
      }
    ],
    [textResolver]
  );

  const resetFilters = useCallback(() => {
    update(prev => {
      return { ...prev, filters: structuredClone(prev.initialFilters) };
    });
  }, [update]);

  const actions = useMemo(
    () => [
      {
        name: 'ResetFilters',
        visible: showFilters,
        component: <Action icon={<RotateLeft />} tooltip={'Reset filters'} handler={resetFilters} />
      },
      {
        name: 'ShowFilters',
        visible: !showFilters,
        component: <Action icon={<ArrowDownward />} tooltip={'Show filters'} handler={() => setShowFilters(true)} />
      },
      {
        name: 'HideFilters',
        visible: showFilters,
        component: (
          <Action
            icon={<ArrowUpward />}
            tooltip={'Hide filters'}
            handler={() => {
              setShowFilters(false);
              resetFilters();
            }}
          />
        )
      }
    ],
    [showFilters, resetFilters]
  );

  useEffect(() => updateActions(actions), [actions, updateActions]);

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid container item xs={12} lg={hasActions ? 8 : 12} spacing={2}>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            onChange={updatePath('filters.search', true)}
            label={textResolver(ListBrowserText.Search)}
            name="search"
            debounceBy={400}
            value={$store.filters.search}
            inputProps={{ maxLength: 255 }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <Autocomplete
            fullWidth
            simpleValue
            onChange={updatePath('pager.orderBy')}
            label={textResolver(ListBrowserText.OrderBy)}
            value={$store.pager.orderBy}
            options={$store.orderByFields}
            valueKey="value"
            labelKey="label"
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <Autocomplete
            fullWidth
            simpleValue
            onChange={updatePath('pager.direction')}
            label={textResolver(ListBrowserText.Direction)}
            value={$store.pager.direction}
            options={directionOptions}
            valueKey="value"
            labelKey="label"
          />
        </Grid>
      </Grid>
      {hasActions && (
        <Grid container item xs={12} lg={4} justifyContent={'flex-end'}>
          {$store.actions
            .filter(action => action.visible)
            .map(action => (
              <React.Fragment key={action.name}>{action.component}</React.Fragment>
            ))}
        </Grid>
      )}
      <Collapse in={showFilters} style={{ width: '100%' }}>
        {filters && <InternalFiltersComponent<TData, TFilters, TStore> filters={filters} store={store} />}
        {!filters && FiltersComponent && <FiltersComponent />}
      </Collapse>
    </Grid>
  );
};

export default Header;

type InternalFiltersComponentProps<
  TData extends object,
  TFilters extends object,
  TStore extends ListBrowserShape<TData, TFilters>
> = {
  store: Writable<TStore>;
  filters: FilterShape<TFilters>[];
};

const InternalFiltersComponent = <
  TData extends object,
  TFilters extends object,
  TStore extends ListBrowserShape<TData, TFilters>
>({
  filters,
  store
}: InternalFiltersComponentProps<TData, TFilters, TStore>) => {
  const $store = useReadable(store);
  const { updatePath } = useUtils<TData, TFilters, TStore>(store);

  return (
    <Grid container item xs={12} spacing={2}>
      {filters.map(filter => {
        let inputComponent;
        switch (filter.type) {
          case 'text':
            inputComponent = (
              <TextField
                fullWidth
                type="text"
                debounceBy={400}
                name={filter.name}
                label={filter.label}
                value={($store.filters[filter.name] as string) || ''}
                onChange={updatePath(`filters.${filter.name}`, true)}
              />
            );
            break;
          case 'number':
            inputComponent = (
              <TextField
                fullWidth
                isNumeric
                debounceBy={400}
                name={filter.name}
                label={filter.label}
                value={($store.filters[filter.name] as number) || ''}
                onChange={updatePath(`filters.${filter.name}`, true)}
              />
            );
            break;
          case 'checkbox':
            inputComponent = (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean($store.filters[filter.name])}
                    onChange={ev => updatePath(`filters.${filter.name}`, true)(ev.target.checked)}
                    name={filter.name}
                    color="primary"
                  />
                }
                label={filter.label}
              />
            );
            break;
          case 'select':
            inputComponent = (
              <Autocomplete
                fullWidth
                simpleValue
                onChange={updatePath(`filters.${filter.name}`, true)}
                label={filter.label}
                value={$store.filters[filter.name] || ''}
                options={filter.options || []}
                valueKey="value"
                labelKey="label"
              />
            );
            break;
          default:
            inputComponent = <></>;
        }
        return (
          <Grid item xs={12} lg={4} key={filter.name}>
            {inputComponent}
          </Grid>
        );
      })}
    </Grid>
  );
};
