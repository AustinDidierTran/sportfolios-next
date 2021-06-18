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
}

const Practice: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { id, location, name, startTime, endTime, rsvp, onClick } = props;
  const [rsvpValue, setRsvpValue] = useState<IRsvp[]>(rsvp);
  const [openRsvp, setOpenRsvp] = useState<boolean>(true);

  useEffect(() => {
    rsvpValue?.map((event) => {
      if (event.rsvp) {
        setOpenRsvp(false);
      }
    });
  }, []);

  const onSetRsvp = (newRsvp: string): void => {
    rsvpValue.forEach((r: any) => {
      r.rsvp = newRsvp;
    });

    setRsvpValue([...rsvpValue]);
  };

  return (
    <Card className={styles.practice}>
      <CardContent className={styles.content} onClick={() => onClick(props)}>
        <Typography className={styles.title} color="textPrimary">
          {name ? name : t('practice')}
        </Typography>
        <Typography className={styles.main} color="textPrimary">
          <ListItemIcon>
            {rsvpValue.length > 1 ? (
              rsvpValue.map((event, index) => (
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
            ) : (
              <div>{t(rsvpValue[0].rsvp)}</div>
            )}
          </ListItemIcon>
          <ListItemText
            className={styles.time}
            primary={`${formatDate(moment.utc(startTime), 'HH:mm')} - ${formatDate(moment.utc(endTime), 'HH:mm')}`}
            secondary={formatDate(moment.utc(startTime), 'ddd D MMM')}
          ></ListItemText>
          <Typography color="textSecondary">{location}</Typography>
        </Typography>
      </CardContent>
      <Rsvp isOpen={openRsvp} practiceId={id} OnSetRsvp={onSetRsvp} multipleRsvp={rsvpValue.length > 1} />
    </Card>
  );
};

export default Practice;
