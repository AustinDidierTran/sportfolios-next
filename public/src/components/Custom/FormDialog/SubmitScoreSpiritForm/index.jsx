import React, { useEffect, useMemo, useState } from 'react';

import Button from '../../Button';
import Icon from '../../Icon';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import styles from './SubmitScoreSpiritForm.module.css';
import api from '../../../../actions/api';
import { useTranslation } from 'react-i18next';
import { formatRoute } from '../../../../../common/utils/stringFormat';
import dynamic from 'next/dynamic';

const SectionScore = dynamic(() => import('./SectionScore'));
// const SectionSpirit = dynamic(() => import('./SectionSpirit'));
// const SectionPresences = dynamic(() => import('./SectionPresences'));

export default function SubmitScoreDialog(props) {
  const { open, onClose, gameId, submissionerInfos, update } = props;
  const { t } = useTranslation();

  const getData = async () => {
    const { data } = await api(
      formatRoute('/api/entity/gameSubmissionInfos', null, {
        gameId,
        rosterId: submissionerInfos.myTeam.rosterId,
      })
    );
    setsubmissionInfos(data);
  };

  const [submissionInfos, setsubmissionInfos] = useState({});

  const personName = useMemo(() => submissionerInfos?.person?.completeName || '', [submissionerInfos?.person]);
  const teamName = useMemo(() => submissionerInfos?.myTeam?.name || '', [submissionerInfos?.myTeam]);

  useEffect(() => {
    if (open) {
      getData();
    }
  }, [open]);

  const SubmittedCheck = (
    <div className={styles.submitted}>
      <Typography className={styles.submitText}>{t('submitted')}</Typography>
      <Icon icon="CheckCircleOutline" color="#54AF51" />
    </div>
  );

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth={'xs'} fullWidth>
      <DialogTitle id="form-dialog-title">{t('submit_score')}</DialogTitle>
      <div>
        <DialogContent>
          <DialogContentText>
            {t('submitting_as_for', {
              person: personName,
              team: teamName,
            })}
          </DialogContentText>
          <SectionScore
            gameId={gameId}
            IsSubmittedCheck={SubmittedCheck}
            suggestions={submissionInfos?.scoreSuggestions}
            submissionerInfos={submissionerInfos}
            update={update}
          />
          {/* <SectionSpirit
            gameId={gameId}
            IsSubmittedCheck={SubmittedCheck}
            submittedSpirit={submissionInfos?.spiritSubmission}
            submissionerInfos={submissionerInfos}
          /> */}
          {/* <SectionPresences
            gameId={gameId}
            IsSubmittedCheck={SubmittedCheck}
            submittedAttendances={submissionInfos?.presences}
            submissionerInfos={submissionerInfos}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t('close')}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
