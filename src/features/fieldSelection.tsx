import { useWritable, Writable } from 'react-use-svelte-store';
import { useState, useMemo, useCallback, MouseEvent } from 'react';
import { Menu, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import { FilterList, CheckBoxOutlineBlank, CheckBox } from '@material-ui/icons';
import Action from '../Action';
import { useTranslation } from 'react-i18next';
import useUtils from '../hooks/useUtils';
import { ListBrowserShape } from '../metadata';

type FieldShape = {
  name: string;
  label: string;
  selected: boolean;
};

export class WithFieldSelection {
  fields: FieldShape[];

  constructor() {
    this.fields = [];
  }
}

type FieldSelectionActionProps<T extends WithFieldSelection> = {
  store: Writable<T>;
};

export const FieldSelectionAction = <T extends WithFieldSelection>({ store }: FieldSelectionActionProps<T>) => {
  const { t } = useTranslation();
  const [$store, , update] = useWritable(store);
  const [menuAnchorEl, setMenuAnchorEl] = useState<Element | null>(null);

  const close = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const open = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const toggleFieldSelection = useCallback(
    (name: string) => {
      update(prev => {
        const newValue = { ...prev, fields: [...prev.fields] };
        const field = newValue.fields.find(field => field.name === name);
        if (field) field.selected = !field.selected;
        return newValue;
      });
    },
    [update]
  );

  return (
    <>
      <Action icon={<FilterList />} tooltip={t('General.ChooseFields')} handler={open} />
      <Menu id="visible-fields-menu" anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={close}>
        {$store.fields.map(field => (
          <MenuItem key={field.name}>
            <FormControlLabel
              control={
                <Checkbox
                  id={field.name}
                  icon={<CheckBoxOutlineBlank fontSize="small" />}
                  checkedIcon={<CheckBox fontSize="small" />}
                  checked={field.selected}
                  onChange={() => toggleFieldSelection(field.name)}
                />
              }
              label={t(field.label)}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export const useFieldSelection = <
  TData extends object,
  TFilters extends object,
  TStore extends ListBrowserShape<TData, TFilters> & WithFieldSelection
>(
  store: Writable<TStore>
) => {
  const { useActions } = useUtils<TData, TFilters, TStore>(store);

  const actions = useMemo(
    () => [
      {
        name: 'FieldSelection',
        visible: true,
        component: <FieldSelectionAction store={store} />
      }
    ],
    [store]
  );

  useActions(actions);
};
