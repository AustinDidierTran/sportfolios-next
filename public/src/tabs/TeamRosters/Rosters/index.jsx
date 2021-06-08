import React, { useContext, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import FormDialog from '../../../components/Custom/FormDialog';
import { Store } from '../../../Store';
import { FORM_DIALOG_TYPE_ENUM } from '../../../../common/enums';
import { formatRoute } from '../../../utils/stringFormats';
import styles from './Rosters.module.css';
import Roster from './Roster';

export default function Rosters(props) {
  const { adminView } = props;
  const { t } = useTranslation();
  const {
    state: { id: teamId },
  } = useContext(Store);

  useEffect(() => {
    if (teamId) {
      getRosters();
    }
  }, [teamId]);

  const [open, setOpen] = useState(false);
  const [rosters, setRosters] = useState([]);

  const getRosters = async () => {
    const { rosters } = await api(
      formatRoute('/api/entity/rosters', null, {
        teamId,
      })
    );
    setRosters(rosters);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Paper title={t('rosters')} className={styles.rosters}>
        {adminView ? (
          <Button
            className={styles.button}
            onClick={() => {
              setOpen(true);
            }}
          >
            {t('add.add_roster')}
          </Button>
        ) : (
          <></>
        )}
        {rosters.map((roster, index) => (
          <Roster key={roster.id} roster={roster} index={index} update={getRosters} isAdmin={adminView}></Roster>
        ))}
      </Paper>
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.ADD_ROSTER}
        items={{
          open,
          onClose,
          update: getRosters,
        }}
      />
    </>
  );
}
