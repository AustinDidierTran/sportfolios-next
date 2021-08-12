import React, { useState } from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import CustomIcon from '../Icon';

const AccordionSummary = withStyles({
  content: {
    margin: '4px 0',
  },
})(MuiAccordionSummary);

interface IProps {
  title: string;
  content: any;
  subtitle?: string;
}

const CustomAccordion: React.FunctionComponent<IProps> = (props) => {
  const { title, subtitle, content, ...otherProps } = props;

  const [expanded, setExpanded] = useState<boolean>(false);

  const onExpand = (): void => {
    const exp = !expanded;
    setExpanded(exp);
  };

  return (
    <Accordion expanded={expanded} onChange={onExpand} {...otherProps}>
      {subtitle ? (
        <AccordionSummary expandIcon={<CustomIcon icon="ExpandMore" />}>
          <ListItemText primary={title} secondary={subtitle} />
        </AccordionSummary>
      ) : (
        <MuiAccordionSummary expandIcon={<CustomIcon icon="ExpandMore" />}>
          <ListItemText primary={title} />
        </MuiAccordionSummary>
      )}

      <AccordionDetails>{content}</AccordionDetails>
    </Accordion>
  );
};
export default CustomAccordion;
