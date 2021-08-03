import React, { useState, useMemo, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../../../Store';
import CustomButton from '../../Button';
import { updateGameRsvp, updatePracticeRsvp } from '../../../../actions/service/entity/put';
import { SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../common/errors';
import styles from './Rsvp.module.css';
import { COLORS } from '../../../../utils/colors';

interface IProps {
  isOpen: boolean;
  practiceId?: string;
  gameId?: string;
  rsvpStatus?: string;
  playerId?: string;
  personId?: string;
  multipleRsvp?: boolean;
  rosterId?: string;
  update: (rsvp?: string, personId?: string) => void;
}

const RsvpComponent: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { isOpen, practiceId, gameId, rsvpStatus, personId, playerId, multipleRsvp, rosterId, update } = props;
  const { dispatch } = useContext(Store);

  const [goingVariant, setGoingVariant] = useState<'outlined' | 'text' | 'contained' | undefined>('outlined');
  const [notGoingVariant, setNotGoingVariant] = useState<'outlined' | 'text' | 'contained' | undefined>('outlined');

  const changeStatus = (status: string): void => {
    if (status == 'going') {
      setGoingVariant('contained');
      setNotGoingVariant('outlined');
    } else if (status == 'not_going') {
      setNotGoingVariant('contained');
      setGoingVariant('outlined');
    } else {
      setNotGoingVariant('outlined');
      setGoingVariant('outlined');
    }
  };

  useEffect((): void => {
    changeStatus(rsvpStatus);
  }, [playerId]);

  const open = useMemo((): boolean => {
    if (isOpen) {
      changeStatus(rsvpStatus);
    }
    return isOpen;
  }, [isOpen, rsvpStatus]);

  const submitRsvp = async (type: string): Promise<void> => {
    let status = 404;
    if (practiceId) {
      status = await updatePracticeRsvp(practiceId, type, personId, multipleRsvp);
    } else if (gameId) {
      status = await updateGameRsvp(gameId, type, personId, rosterId, multipleRsvp);
    }
    if (status === REQUEST_STATUS_ENUM.ERROR || status >= 400) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else {
      update(type, personId);
    }
  };

  return (
    <div>
      {open ? (
        <div className={styles.div}>
          <CustomButton
            className={styles.rsvpButton}
            startIcon="Check"
            color="primary"
            textColor={goingVariant == 'outlined' ? COLORS.turquoise : COLORS.white}
            variant={goingVariant}
            onClick={() => {
              submitRsvp('going');
            }}
          >
            {t('going')}
          </CustomButton>
          <CustomButton
            className={styles.rsvpButton}
            startIcon="Close"
            color="secondary"
            textColor="primary"
            variant={notGoingVariant}
            onClick={() => {
              submitRsvp('not_going');
            }}
          >
            {t('not_going')}
          </CustomButton>
        </div>
      ) : null}
    </div>
  );
};

export default RsvpComponent;
