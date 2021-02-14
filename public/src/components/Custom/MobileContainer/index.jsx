import React from 'react';

import styles from './MobileContainer.module.css';

export default function MobileContainer(props) {
  const { className, children } = props;
  return <div className={className ? [className, styles.main].join(' ') : styles.main}>{children}</div>;
}
