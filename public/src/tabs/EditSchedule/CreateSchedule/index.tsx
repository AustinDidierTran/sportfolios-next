import React, { useContext } from 'react';
import { Button } from '../../../components/Custom';
import styles from '../EditSchedule.module.css';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../actions/goTo';
import { Store } from '../../../Store';

const CreateSchedule: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const handleClick = (): void => {
    goTo(ROUTES.scheduleInteractiveTool, { id: eventId });
  };

  return (
    <Button
      size="small"
      variant="contained"
      endIcon="Build"
      style={{ margin: '8px' }}
      onClick={handleClick}
      className={styles.button}
    >
      {t('schedule_manager')}
    </Button>
  );
};
export default CreateSchedule;
