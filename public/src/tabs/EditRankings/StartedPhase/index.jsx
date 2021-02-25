import React, { useEffect, useState, useContext } from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './StartedPhase.module.css';
import Icon from '../../../components/Custom/Icon';
import Button from '../../../components/Custom/Button';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'lightGrey' },
    justifySelf: 'end',
  },
}));

export default function PhaseAccordionDnD(props) {
  const { phase, isOneExpanded, expandedPhases, setExpandedPhases, onOpenAlertDialog, ...otherProps } = props;
  const { content, ranking, phaseId } = phase;

  const classes = useStyles();
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);
  const [teams, setTeams] = useState(ranking);

  useEffect(() => {
    setTeams(ranking);
  }, [ranking]);

  const onExpand = () => {
    setExpanded(true);
    if (!expandedPhases.includes(phaseId)) {
      setExpandedPhases(expandedPhases.concat([phaseId]));
    }
  };

  const onShrink = () => {
    setExpanded(false);
    if (expandedPhases.includes(phaseId)) {
      const newExpandedPhases = expandedPhases.filter((p) => p !== phaseId);
      setExpandedPhases(newExpandedPhases);
    }
  };

  return (
    <>
      <Accordion expanded={expanded} onChange={expanded ? onShrink : onExpand} {...otherProps}>
        <AccordionSummary expandIcon={<Icon icon="ExpandMore" className={classes.primary} />}>
          <div className={styles.orderContainer}>
            <ListItemIcon>
              {expanded || isOneExpanded ? <></> : <Icon icon="Reorder" color="textSecondary" />}
            </ListItemIcon>
          </div>
          <ListItemText primary={content + ' - ' + t('phase_in_progress')} />
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.div}>
            <div className={styles.buttonContainer}>
              <Button
                onClick={() => {
                  onOpenAlertDialog(phase);
                }}
                color={'primary'}
                endIcon="Check"
              >
                {t('end_phase')}
              </Button>
            </div>
            <div>
              {teams.map((team, index) => (
                <div key={index}>
                  <ListItem>
                    <div className={styles.main} style={{ width: '100%' }}>
                      <ListItemText className={styles.position} secondary={index + 1} />
                      <ListItemText className={styles.name} primary={team.content} />
                    </div>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
