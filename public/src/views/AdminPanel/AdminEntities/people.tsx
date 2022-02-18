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
import { Person } from '../../../../../typescript/entity';
import { getAllThePeople, deletePerson } from '../../../actions/service/person/admin';
import styles from '../AdminEntitiesView.module.css';

const PERSON_LIMIT = 10;

const People: React.FunctionComponent<Record<string, unknown>> = () => {
  const { t } = useTranslation();

  const [people, setPeople] = useState<Person[]>([]);
  const [personCount, setPersonCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const personSearchQuery = useFormInput('');

  const pageAmount = useMemo(() => Math.ceil(personCount / PERSON_LIMIT), [personCount, PERSON_LIMIT]);

  const updatePeople = useCallback(() => {
    getAllThePeople(PERSON_LIMIT, page, personSearchQuery.value).then((res) => {
      setPeople(res.people);
      setPersonCount(res.count);
    });
  }, [PERSON_LIMIT, page, personSearchQuery.value]);

  const onPersonDelete = useCallback((id, restore) => {
    deletePerson(id, restore).then(() => updatePeople());
  }, []);

  useEffect(() => {
    updatePeople();
  }, [updatePeople]);

  return (
    <Paper className={styles.card}>
      <Typography gutterBottom variant="h5" component="h2">
        {t('person.people')}
      </Typography>
      <TextField {...personSearchQuery.inputProps} placeholder={t('search')} />
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
        {people?.map((t: Person, index: number) => (
          <React.Fragment key={index}>
            <ListItem>
              <CustomAvatar photoUrl={t.photoUrl} />
              <ListItemText primary={t.name + t.surname} />
              <IconButton edge="end" onClick={() => onPersonDelete(t.id, Boolean(t.deletedAt))}>
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

export default People;
