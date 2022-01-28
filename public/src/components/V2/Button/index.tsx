import React, { MouseEventHandler } from 'react';

import styles from './Button.module.css';

interface Props {
  className: string;
  children: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const Button: React.FunctionComponent<Props> = ({ className, children, onClick, disabled = false }) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      onClick={onClick}
      style={{ backgroundColor: disabled ? 'rgba(186, 186, 186, 1)' : '' }}
    >
      {children}
    </button>
  );
};

export default Button;
