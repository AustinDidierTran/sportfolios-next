import React, { useEffect, useMemo, useState, useContext } from 'react';

import Button from '../../Button';
import Icon from '../../Icon';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import styles from './SubmitScoreSpiritForm.module.css';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { Store } from '../../../../Store';
import { getGameSubmissionInfos } from '../../../../actions/service/entity/get';
import { GameSubmissionInfo, PersonAdmin, SubmissionerTeam } from '../../../../../../typescript/types';

interface IProps {
  open: boolean;
  gameId: string;
  submissionerInfos: ISubmissionerInfos;
  onClose: () => void;
  update: () => void;
}

interface ISubmissionerInfos {
  myTeam: SubmissionerTeam;
  enemyTeam: SubmissionerTeam;
  person: PersonAdmin;
}

const SectionScore = dynamic(() => import('./SectionScore'));
const SectionSpirit = dynamic(() => import('./SectionSpirit'));
// const SectionPresences = dynamic(() => import('./SectionPresences'));

const SubmitScoreDialog: React.FunctionComponent<IProps> = (props) => {
  const { open, onClose, gameId, submissionerInfos, update } = props;
  const { t } = useTranslation();
  const {
    state: { id: entityId },
  } = useContext(Store);

  const getData = async () => {
    getGameSubmissionInfos(gameId, submissionerInfos.myTeam.rosterId, entityId).then(setsubmissionInfos);
  };

  const [submissionInfos, setsubmissionInfos] = useState<GameSubmissionInfo>();

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
          {submissionInfos?.hasSpirit ? (
            <SectionSpirit
              gameId={gameId}
              IsSubmittedCheck={SubmittedCheck}
              submittedSpirit={submissionInfos?.spiritSubmission}
              submissionerInfos={submissionerInfos}
            />
          ) : null}
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
};
export default SubmitScoreDialog;
