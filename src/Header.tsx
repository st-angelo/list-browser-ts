import React from 'react';
import { Collapse, Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import { ArrowUpward, ArrowDownward, RotateLeft } from '@material-ui/icons';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useReadable, useWritable, Writable } from 'react-use-svelte-store';
import Action from './Action';
import useUtils from './hooks/useUtils';
import { FilterShape, getDirectionOptions, ListBrowserShape } from './metadata';
import Select from './temp/components/select/Select';
import DebouncedTextField from './temp/components/textField/DebouncedTextField';
import cloneDeep from 'lodash.clonedeep';

type HeaderProps<TData extends object, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>> = {
  store: Writable<TStore>;
  filters?: FilterShape<TFilters>[];
  FiltersComponent?: () => JSX.Element;
};

const Header = <TData extends object, TFilters extends object, TStore extends ListBrowserShape<TData, TFilters>>({
  store: _store,
  filters,
  FiltersComponent
}: HeaderProps<TData, TFilters, TStore>) => {
  const { t } = useTranslation();
  const [store, , update] = useWritable(_store);
  const [showFilters, setShowFilters] = useState(false);

  const { updateStore, addOrUpdateActions } = useUtils<TData, TFilters, TStore>(_store);

  const hasActions = useMemo(() => store.actions.length > 0, [store.actions.length]);

  const resetFilters = useCallback(() => {
    update(prev => {
      return { ...prev, filters: cloneDeep(prev.initialFilters) };
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

  useEffect(() => {
    addOrUpdateActions(actions);
  }, [addOrUpdateActions, actions]);

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid container item xs={12} lg={hasActions ? 8 : 12} spacing={2}>
        <Grid item xs={12} lg={6}>
          <DebouncedTextField
            fullWidth
            onChange={updateStore('filters.search')}
            label={t('General.Search')}
            name="search"
            value={store.filters.search}
            inputProps={{ maxLength: 255 }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <Select
            fullWidth
            onChange={ev => updateStore('pager.orderBy')(ev.target.value)}
            label={t('General.OrderBy')}
            name="orderBy"
            value={store.pager.orderBy}
            options={store.orderByFields}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <Select
            fullWidth
            onChange={ev => updateStore('pager.direction')(ev.target.value)}
            label={t('General.Direction')}
            name="direction"
            value={store.pager.direction}
            options={getDirectionOptions()}
          />
        </Grid>
      </Grid>
      {hasActions && (
        <Grid container item xs={12} lg={4} justifyContent={'flex-end'}>
          {store.actions
            .filter(action => action.visible)
            .map(action => (
              <React.Fragment key={action.name}>{action.component}</React.Fragment>
            ))}
        </Grid>
      )}
      <Collapse in={showFilters} style={{ width: '100%' }}>
        {filters && <InternalFiltersComponent<TData, TFilters, TStore> filters={filters} store={_store} />}
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
  store: _store
}: InternalFiltersComponentProps<TData, TFilters, TStore>) => {
  const store = useReadable(_store);
  const { updateStore } = useUtils<TData, TFilters, TStore>(_store);

  return (
    <Grid container item xs={12} spacing={2}>
      {filters.map(filter => {
        let inputComponent;
        switch (filter.type) {
          case 'text':
            inputComponent = (
              <DebouncedTextField
                fullWidth
                type="text"
                name={filter.name}
                label={filter.label}
                value={store.filters[filter.name]}
                onChange={updateStore(`filters.${filter.name}`)}
              />
            );
            break;
          case 'number':
            inputComponent = (
              <DebouncedTextField
                fullWidth
                type="number"
                name={filter.name}
                label={filter.label}
                value={store.filters[filter.name]}
                onChange={value => updateStore(`filters.${filter.name}`)(parseInt(value))}
              />
            );
            break;
          case 'checkbox':
            inputComponent = (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(store.filters[filter.name])}
                    onChange={ev => updateStore(`filters.${filter.name}`)(ev.target.checked)}
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
              <Select
                fullWidth
                onChange={ev => updateStore(`filters.${filter.name}`)(ev.target.value)}
                label={filter.label}
                name={filter.name}
                value={store.filters[filter.name]}
                options={filter.options || []}
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
