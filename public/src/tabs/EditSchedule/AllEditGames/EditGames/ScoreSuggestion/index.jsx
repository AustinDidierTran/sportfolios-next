import React, { useState, useEffect, useMemo } from 'react';
import { STATUS_ENUM } from '../../../../../../common/enums';
import api from '../../../../../actions/api';
import EditGame from './EditGame';
import { IconButton, Collapse } from '../../../../../components/Custom';
import Typography from '@material-ui/core/Typography';

import { useTranslation } from 'react-i18next';
import styles from './ScoreSuggestion.module.css';
import { makeStyles } from '@material-ui/core/styles';
import { formatRoute } from '../../../../../utils/stringFormats';
import { COLORS } from '../../../../../utils/colors';
import ScoreSuggestionCard from '../../../../../components/Custom/Card/ScoreSuggestion';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: COLORS.lightGrey },
  },
}));

export default function ScoreSuggestion(props) {
  const { game, update, withoutEdit } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  const [suggestions, setSuggestions] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const icon = useMemo(() => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'), [expanded]);
  const message = useMemo(() => (expanded ? '' : t('score.score_suggestions')), [expanded]);

  useEffect(() => {
    getSuggestions();
  }, []);

  const getSuggestions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/scoreSuggestion', null, {
        gameId: game.id,
      }),
      { method: 'GET' }
    );

    if (data.length) {
      setSuggestions(data);
    }

    const expanded = data.some((s) => s.status === STATUS_ENUM.PENDING);
    if (!expanded) {
      setTimeout(() => {
        setExpanded(expanded);
      }, 500);
    } else {
      setExpanded(expanded);
    }
  };

  const updateSuggestions = () => {
    update();
    getSuggestions();
  };

  return (
    <>
      <EditGame update={updateSuggestions} game={game} withoutEdit={withoutEdit || suggestions.length} />
      {suggestions.length ? (
        <>
          <div className={styles.collapse} onClick={handleExpand}>
            <Typography className={styles.seeScore} color="textSecondary">
              {message}
            </Typography>
            <IconButton
              aria-expanded={expanded}
              icon={icon}
              className={classes.primary}
              style={{ color: COLORS.grey }}
            />
          </div>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {suggestions.map((suggestion, index) => (
              <ScoreSuggestionCard
                game={game}
                suggestion={suggestion}
                index={index}
                update={updateSuggestions}
                key={index}
              />
            ))}
          </Collapse>
        </>
      ) : (
        <div style={{ marginBottom: '16px' }} />
      )}
    </>
  );
}
