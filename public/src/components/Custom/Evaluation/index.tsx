import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { Evaluation as IEvaluation, EvaluationComment } from '../../../../../typescript/types';

interface IProps {
  evaluation: IEvaluation;
  role: string;
}

const Evaluation: React.FunctionComponent<IProps> = (props) => {
  const { evaluation, role } = props;
  const { t } = useTranslation();

  if (role == 'coach') {
    return null; //TODO next pr
  } else {
    return (
      <>
        <Typography color="textSecondary">
          {evaluation.rating ? t('Rating') + ' : ' + evaluation.rating : null}
        </Typography>
        <Typography color="textSecondary">
          {evaluation?.comments
            ? evaluation.comments.length > 1
              ? t('comments') + ' : '
              : t('comment') + ' : '
            : null}
        </Typography>

        {evaluation?.comments?.map((comment: EvaluationComment, index:number) => (
          <ListItemText key={index} secondary={comment.content} />
        ))}
      </>
    );
  }
};
export default Evaluation;
