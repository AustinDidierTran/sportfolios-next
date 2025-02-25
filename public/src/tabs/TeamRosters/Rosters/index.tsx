import React, { useContext, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import FormDialog from '../../../components/Custom/FormDialog';
import { Store } from '../../../Store';
import { FORM_DIALOG_TYPE_ENUM } from '../../../../common/enums';
import styles from './Rosters.module.css';
import Roster from './Roster';
import { Roster as RosterType } from '../../../../../typescript/types';
import { getRosters as getRostersApi } from '../../../actions/service/entity/get';
import Typography from '@material-ui/core/Typography';

interface IProps {
  adminView: boolean;
}

const Rosters: React.FunctionComponent<IProps> = (props) => {
  const { adminView } = props;
  const { t } = useTranslation();
  const {
    state: { id: teamId },
  } = useContext(Store);

  useEffect((): void => {
    if (teamId) {
      getRosters();
    }
  }, [teamId]);

  const [open, setOpen] = useState<boolean>(false);
  const [rosters, setRosters] = useState<RosterType[]>([]);

  const getRosters = async () => {
    const rosters = await getRostersApi(teamId);
    setRosters(rosters);
  };

  const onClose = (): void => {
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
        ) : null}
        {rosters.length < 1 ? (
          <Typography color="textSecondary" style={{ margin: '16px' }}>
            {t('no.no_roster')}
          </Typography>
        ) : (
          <>
            {rosters?.map((roster, index) => (
              <Roster key={roster.id} roster={roster} index={index} update={getRosters} isAdmin={adminView} />
            ))}
          </>
        )}
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
};
export default Rosters;
