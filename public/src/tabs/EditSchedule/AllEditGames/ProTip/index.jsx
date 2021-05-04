import React from 'react';
import { Icon } from '../../../../components/Custom';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import styles from './ProTip.module.css';
import { useWindowSize } from '../../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../../common/constants';

export default function ProTip() {
  const { t } = useTranslation();
  const [width] = useWindowSize();

  return (
    <div className={styles.proTip}>
      {width < MOBILE_WIDTH ? <></> : <Icon icon="EmojiObjects" color="grey" />}
      <Typography color="textSecondary" variant="body2">
        {t('you.you_can_click_on_a_game_to_change_score')}
      </Typography>
    </div>
  );
}
