import { TextField, TextFieldProps } from '@material-ui/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

type DebouncedTextFieldProps = Omit<TextFieldProps, 'onChange'> & {
  onChange: (value: string) => void;
  delay?: number;
};

const DebouncedTextField = ({ delay = 400, value, onChange = () => {}, ...rest }: DebouncedTextFieldProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const debounced = useRef(debounce(newValue => onChange(newValue), delay));

  useEffect(() => setInternalValue(value), [value]);

  const handleUpdate = useCallback(ev => {
    const newValue = ev.target.value;
    setInternalValue(newValue);
    debounced.current(newValue);
  }, []);

  return <TextField value={internalValue} onChange={handleUpdate} {...rest} />;
};

export default DebouncedTextField;
