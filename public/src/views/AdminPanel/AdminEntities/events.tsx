import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CustomAvatar from '../../../components/Custom/Avatar';
import Delete from '@material-ui/icons/Delete';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import Restore from '@material-ui/icons/Restore';
import Button from '@material-ui/core/Button';
import { useFormInput } from '../../../hooks/forms';
import { Event } from '../../../../../typescript/entity';
import { getAllTheEvents, deleteEvent } from '../../../actions/service/event/admin';
import styles from '../AdminEntitiesView.module.css';

const EVENT_LIMIT = 10;

const Events: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const [events, setEvents] = useState<Event[]>([]);
  const [eventCount, setEventCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const eventSearchQuery = useFormInput('');

  const pageAmount = useMemo(() => Math.ceil(eventCount / EVENT_LIMIT), [eventCount, EVENT_LIMIT]);

  const updateEvents = useCallback(() => {
    getAllTheEvents(EVENT_LIMIT, page, eventSearchQuery.value).then((res) => {
      setEvents(res.events);
      setEventCount(res.count);
    });
  }, [EVENT_LIMIT, page, eventSearchQuery.value]);

  const onEventDelete = useCallback((id, restore) => {
    deleteEvent(id, restore).then(() => updateEvents());
  }, []);

  useEffect(() => {
    updateEvents();
  }, [updateEvents]);

  return (
    <Paper className={styles.card}>
      <Typography gutterBottom variant="h5" component="h2">
        {t('event.events')}
      </Typography>
      <TextField {...eventSearchQuery.inputProps} placeholder={t('search.title')} />
      <div className={styles.paging}>
        <Button startIcon={<ArrowBackIosRoundedIcon />} onClick={() => setPage((page) => Math.max(1, page - 1))} />
        <span>
          Page {page} of {pageAmount}
        </span>
        <Button
          endIcon={<ArrowForwardIosRoundedIcon />}
          onClick={() => setPage((page) => Math.min(pageAmount, page + 1))}
        />
      </div>
      <List>
        {events?.map((t: Event, index: number) => (
          <React.Fragment key={index}>
            <ListItem>
              <CustomAvatar photoUrl={t.photoUrl} />
              <ListItemText primary={t.name} />
              <IconButton edge="end" onClick={() => onEventDelete(t.id, Boolean(t.deletedAt))}>
                {t.deletedAt ? <Restore /> : <Delete />}
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default Events;
