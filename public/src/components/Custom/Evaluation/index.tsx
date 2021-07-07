import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import styles from './Evaluation.module.css';
import { Evaluation as IEvaluation } from '../../../../../typescript/types';
import EvaluationItem from './EvaluationItem';

interface IProps {
  evaluations: IEvaluation[];
}

const Evaluation: React.FunctionComponent<IProps> = (props) => {
  const { evaluations } = props;

  return (
    <>
      {evaluations?.map((evaluation: IEvaluation, index: number) => (
        <ListItem className={index % 2 === 0 ? styles.greycard : styles.card} key={index}>
          <EvaluationItem evaluation={evaluation} isCoach/>
        </ListItem>
      ))}
    </>
  );
};
export default Evaluation;
