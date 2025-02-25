import React from 'react';

import styles from './BottomPageLogo.module.css';
import { LOGO_ENUM } from '../../../../common/enums';

export default function BottomPageLogo() {
  return (
    <div className={styles.logo}>
      <img className={styles.img} src={LOGO_ENUM.LOGO_512X512} />
    </div>
  );
}
