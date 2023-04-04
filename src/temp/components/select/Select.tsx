import { FormControl, InputLabel, NativeSelect, NativeSelectProps } from '@material-ui/core';
import { SelectOption } from '../../../metadata';

type SelectProps = NativeSelectProps & {
  label: string;
  options: SelectOption[];
};

const Select = ({ options, label, ...rest }: SelectProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <NativeSelect {...rest}>
        {options.map(option => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

export default Select;
