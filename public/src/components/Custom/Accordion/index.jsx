import React, { useState } from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CustomIcon from '../Icon';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'lightGrey' },
    justifySelf: 'end',
  },
}));

const AccordionSummary = withStyles({
  content: {
    '&$expanded': {
      margin: '8px 0',
    },
    margin: '4px 0',
  },
})(MuiAccordionSummary);

export default function CustomAccordion(props) {
  const { title, subtitle, content, ...otherProps } = props;
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);

  const onExpand = () => {
    const exp = !expanded;
    setExpanded(exp);
  };

  return (
    <Accordion expanded={expanded} onChange={onExpand} {...otherProps}>
      {subtitle ? (
        <AccordionSummary expandIcon={<CustomIcon icon="ExpandMore" className={classes.primary} />}>
          <ListItemText primary={title} secondary={subtitle} />
        </AccordionSummary>
      ) : (
        <MuiAccordionSummary expandIcon={<CustomIcon icon="ExpandMore" className={classes.primary} />}>
          <ListItemText primary={title} />
        </MuiAccordionSummary>
      )}

      <AccordionDetails>{content}</AccordionDetails>
    </Accordion>
  );
}
