import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Events.module.css';
import { CARD_TYPE_ENUM } from '../../../common/enums';
import Card from '../../components/Custom/Card';
import Typography from '@material-ui/core/Typography';
import { goTo, ROUTES } from '../../actions/goTo';
import CustomButton from '../../components/Custom/Button';
import { Store } from '../../Store';
import { getEntityEvents } from '../../actions/service/entity';
import { OwnedEvents } from '../../../../typescript/types';

interface IProps {
  adminView: boolean;
}

const Events: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { adminView } = props;
  const {
    state: { id },
  } = useContext(Store);
  const [events, setEvents] = useState<OwnedEvents[] | undefined[]>([]);

  const getData = async (): Promise<void> => {
    const events = await getEntityEvents(id);
    setEvents(events || []);
  };

  const createEvent = (): void => {
    goTo(ROUTES.createEvent, null, { id: id });
  };

  useEffect((): void => {
    if (id) {
      getData();
    }
  }, [id]);

  return (
    <div className={styles.div}>
      {adminView && (
        <div className={styles.buttons}>
          <CustomButton onClick={createEvent} endIcon="Add" color="primary" className={styles.button}>
            {t('create.create_event')}
          </CustomButton>
        </div>
      )}
      <div className={styles.general}>
        {events.length ? (
          <>
            {events.map((e, index) => (
              <Card type={CARD_TYPE_ENUM.EVENT} items={e} key={index} />
            ))}
          </>
        ) : (
          <Typography>{t('this_organization_has_no_events')}</Typography>
        )}
      </div>
    </div>
  );
};
export default Events;
