import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { goTo, ROUTES } from '../../../../actions/goTo';
import moment from 'moment';
import { formatIntervalDate } from '../../../../utils/stringFormats';
import CustomButton from '../../Button';
import CustomAvatar from '../../Avatar';
import ImageCard from '../../ImageCard';
import styles from './EventPost.module.css';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../../common/constants';
import { Entity } from '../../../../../../typescript/types';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    flex: '1 1 auto',
    margin: '4px auto',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  media2: {
    height: 200,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    gridArea: 'more',
    alignSelf: 'center',
    justifySelf: 'center',
    transform: 'rotate(0deg)',

    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {},
}));
const flag = false;

interface IProps {
  eventId: string;
  creator: Entity;
  description: string;
  quickDescription: string;
  startDate: string;
  endDate: string;
  location: string;
  name: string;
  photoUrl: string;
}

const EventPost: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [width] = useWindowSize();
  const { eventId, creator, description, quickDescription, startDate, endDate, location, name, photoUrl } = props;

  const handleExpandClick = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        className={styles.header}
        avatar={
          <CustomAvatar
            aria-label="recipe"
            className={classes.avatar}
            photoUrl={(creator && creator.photoUrl) || ''}
          ></CustomAvatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon style={flag ? {} : { color: '#fff' }} />
          </IconButton>
        }
        title={name || ''}
        subheader={(creator && creator.name) || ''}
      />
      <ImageCard
        style={{ cursor: 'pointer' }}
        onClick={() => goTo(ROUTES.entity, { id: eventId })}
        className={width < MOBILE_WIDTH ? classes.media : classes.media2}
        photoUrl={photoUrl || ''}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p" align="left">
          {(quickDescription && decodeURIComponent(quickDescription)) || t('event.event')}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p" align="left">
          {formatIntervalDate(moment.utc(startDate), moment.utc(endDate))}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p" align="left">
          {location || ''}
        </Typography>
      </CardContent>
      <CardActions className={styles.actions} disableSpacing>
        <CustomButton
          onClick={() => goTo(ROUTES.entity, { id: eventId })}
          style={{ width: '50px' }}
          className={styles.eventButton}
        >
          {t('learn_more')}
        </CustomButton>
        {flag ? (
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        ) : (
          <></>
        )}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>{decodeURIComponent(description) || ''}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};
export default EventPost;
