import React from 'react';

import styles from './IgContainer.module.css';

interface IProps {
  className?: string;
  children?: any;
}

const IgContainer: React.FunctionComponent<IProps> = (props) => {
  const { className, children } = props;
  return <div className={className ? [className, styles.main].join(' ') : styles.main}>{children}</div>;
}
export default IgContainer; 