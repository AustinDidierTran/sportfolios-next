import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import styles from './EvaluationItem.module.css';
import { getInitialsFromName } from '../../../../utils/stringFormats';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '../../Avatar';
import { Evaluation as IEvaluation, EvaluationComment } from '../../../../../../typescript/types';

interface IProps {
  evaluation: IEvaluation;
  isCoach?: boolean;
}

const Evaluation: React.FunctionComponent<IProps> = (props) => {
  const { evaluation, isCoach } = props;
  const { t } = useTranslation();
  if (evaluation) {
    return (
      <div>
        {isCoach ? (
          <div className={styles.evaluation}>
            <ListItemIcon>
              <Avatar photoUrl={evaluation.photoUrl} initials={getInitialsFromName(evaluation.name)} />
            </ListItemIcon>
            <ListItemText
              className={styles.element}
              primary={t('name') + ' : ' + evaluation.name + ' ' + evaluation.surname}
            />
            <ListItemText
              className={styles.element}
              primary={
                evaluation.rating ? t('rating') + ' : ' + evaluation.rating : t('rating') + ' : ' + t('not_available')
              }
            />
          </div>
        ) : (
          <ListItemText
            className={styles.element}
            primary={
              evaluation.rating ? t('rating') + ' : ' + evaluation.rating : t('rating') + ' : ' + t('not_available')
            }
          />
        )}
        <Typography className={styles.element} color="textPrimary">
          {evaluation?.comments?.length > 0
            ? evaluation.comments.length > 1
              ? t('comments') + ' : '
              : t('comment') + ' : '
            : null}
        </Typography>

        {evaluation?.comments?.map((comment: EvaluationComment, index) => (
          <ListItemText secondary={comment.content} key={index} />
        ))}
      </div>
    );
  }
  return null;
};
export default Evaluation;
