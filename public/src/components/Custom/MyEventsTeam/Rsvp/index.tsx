import React, { useState, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../../../Store';
import CustomButton from '../../Button';
import { updatePracticeRsvp } from '../../../../actions/service/entity/put';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../common/errors';

interface IProps {
  isOpen: boolean;
  practiceId: string;
  rsvpStatus?: string;
  playerId?: string;
  multipleRsvp?: boolean;
  update: (rsvp?: string, playerId?: string) => void;
}

const RsvpComponent: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { isOpen, practiceId, rsvpStatus, playerId, multipleRsvp, update } = props;
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
    }
  };

  const open = useMemo((): boolean => {
    if(rsvpStatus){
      changeStatus(rsvpStatus);
    }
    return isOpen;
  }, [isOpen, rsvpStatus]);

  const submitRsvp = async (type: string): Promise<void> => {
    const status = await updatePracticeRsvp(practiceId, type, playerId, multipleRsvp);
    if (status === STATUS_ENUM.ERROR || status >= 400) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else {
      update(type, playerId);
    }
  };

  return (
    <div>
      {open ? (
        <div>
          <CustomButton
            startIcon="Check"
            color="primary"
            textColor={goingVariant == 'outlined' ? '#18B393' : 'white'}
            variant={goingVariant}
            onClick={() => {
              submitRsvp('going');
            }}
          >
            {t('going')}
          </CustomButton>
          &nbsp;
          <CustomButton
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
      ) : (
        null
      )}
    </div>
  );
};

export default RsvpComponent;
