import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { ChangeEventHandler, useEffect, useMemo, useRef, useState } from 'react';

interface Classes {
  container?: string;
  icon?: string;
  input?: string;
}

interface TextInputProps {
  autofocus?: boolean;
  classes: Classes;
  onChange: ChangeEventHandler;
  placeholder: string;
  type?: string;
  value: string;
}

import styles from './TextInput.module.css';

const TextInput: React.FunctionComponent<TextInputProps> = ({
  autofocus = false,
  classes = {},
  onChange,
  placeholder,
  type = 'text',
  value,
}) => {
  const inputElement = useRef(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (autofocus && inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

  const Icon = useMemo(() => (showPassword ? Visibility : VisibilityOff), [showPassword]);

  const actualType = useMemo(() => {
    if (type === 'password') {
      if (showPassword) {
        return 'text';
      }
      return 'password';
    }

    return type;
  }, [showPassword, type]);

  return (
    <div className={`${styles.container} ${classes.container}`}>
      <input
        ref={inputElement}
        className={`${styles.input} ${classes.input}`}
        onChange={onChange}
        placeholder={placeholder}
        type={actualType}
        value={value}
      />
      <div className={styles.rightSection}>
        {type === 'password' ? (
          <Icon
            height={16}
            width={16}
            onClick={() => setShowPassword((sp) => !sp)}
            className={`${styles.icon} ${classes.icon}`}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default TextInput;
