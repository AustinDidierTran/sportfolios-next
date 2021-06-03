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
import List from '@material-ui/core/List';
import Roster from './Roster';

export default function Rosters(props) {
  const { update, adminView } = props;
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
    console.log({ rosters });
    setRosters(rosters);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Paper title={t('rosters')}>
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
        {rosters.map((roster) => (
          <Roster roster={roster}></Roster>
        ))}
      </Paper>
      {/* <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.ADD_ROSTER}
        items={{
          open,
          onClose,
          update: getRosters,
          rosters,
        }}
      /> */}
    </>
  );
}
