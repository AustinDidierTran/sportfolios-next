import React, { useState, useEffect } from 'react';

import styles from './Practice.module.css';
import { useTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import Rsvp from '../../MyEventsTeam/Rsvp';
import { getInitialsFromName } from '../../../../utils/stringFormats';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '../../Avatar';
import { Rsvp as IRsvp } from '../../../../../../typescript/types';

interface IProps {
  id: string;
  location: string;
  name: string;
  startTime: string;
  endTime: string;
  rsvp: IRsvp[];
  onClick: (props: IProps) => void;
  update: () => void;
}

const Practice: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { id, location, name = t('practice'), startTime, endTime, rsvp, onClick, update } = props;
  const [openRsvp, setOpenRsvp] = useState<boolean>(rsvp !== null);

  useEffect(() => {
    rsvp?.map((event) => {
      if (event.rsvp) {
        setOpenRsvp(false);
      }
    });
  }, [rsvp]);

  return (
    <Card className={styles.practice}>
      <CardContent className={styles.content} onClick={() => onClick(props)}>
        <Typography className={styles.title} color="textPrimary">
          {name}
        </Typography>
        <div className={styles.main} color="textPrimary">
          <ListItemIcon>
            {rsvp
              ? rsvp.map((event, index) => (
                  <div key={index}>
                    {event.rsvp ? (
                      <Avatar
                        style={event.rsvp == 'going' ? { border: '4px solid green' } : { border: '4px solid red' }}
                        photoUrl={event.photoUrl}
                        initials={getInitialsFromName(event.name)}
                      />
                    ) : (
                      <Avatar photoUrl={event.photoUrl} initials={getInitialsFromName(event.name)} />
                    )}
                  </div>
                ))
              : null}
          </ListItemIcon>
          <ListItemText
            className={styles.time}
            primary={`${formatDate(moment.utc(startTime), 'HH:mm')} - ${formatDate(moment.utc(endTime), 'HH:mm')}`}
            secondary={formatDate(moment.utc(startTime), 'ddd D MMM')}
          ></ListItemText>
          <Typography color="textSecondary">{location}</Typography>
        </div>
      </CardContent>
      <Rsvp isOpen={openRsvp} practiceId={id} update={update} multipleRsvp />
    </Card>
  );
};

export default Practice;
