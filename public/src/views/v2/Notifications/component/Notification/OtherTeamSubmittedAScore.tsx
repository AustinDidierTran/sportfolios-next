import moment from 'moment';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Notification } from '../../../../../../../typescript/notifications';
import Button from '../../../common/Button';
import { ElapsedTimeText } from './ElapsedTimeText';

interface Props {
  notification: Notification;
}

const OtherTeamSubmittedAScore: React.FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();

  const { submitted } = props.notification.metadata;

  const onClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  }, []);

  return (
    <React.Fragment>
      <span>
        {t('notifications.content.other_team_submitted_a_score.1')}
        <b>{props.notification.metadata.eventName}</b>
        {t('notifications.content.other_team_submitted_a_score.2')}
        {Object.entries(JSON.parse(props.notification.metadata.score)).map(([name, score]) => (
          <>
            {' '}
            {name}: <b>{score}</b>
          </>
        ))}
        {t('notifications.content.other_team_submitted_a_score.3')}
        <b>{props.notification.metadata.submittedBy}</b>
        {t('notifications.content.other_team_submitted_a_score.4')}
      </span>
      <ElapsedTimeText>{moment(props.notification.created_at).fromNow()}</ElapsedTimeText>
      <div className="horizontal" style={{ marginTop: '0.5rem' }}>
        <Button disabled color={submitted ? 'outlined' : 'primary'} onClick={onClick}>
          {submitted ? t('confirmed') : t('confirm')}
        </Button>
        <Button>{t('see_more')}</Button>
      </div>
    </React.Fragment>
  );
};

export default OtherTeamSubmittedAScore;
