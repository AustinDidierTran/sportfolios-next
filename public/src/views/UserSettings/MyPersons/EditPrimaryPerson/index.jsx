import React, { useState } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { useTranslation } from 'react-i18next';

export default function EditPrimaryPerson(props) {
  const { t } = useTranslation();
  const { persons, open, handleClose, handleSubmit } = props;
  const [selectedValue, setSelectedValue] = useState(persons[0].id);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const onSubmit = () => {
    handleSubmit(selectedValue);
  };

  const onClose = () => {
    setSelectedValue(persons[0].id);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('choose_your_primary_person')}</DialogTitle>
      <DialogContent>
        <FormControl>
          <RadioGroup value={selectedValue} onChange={handleChange}>
            {persons.map((person, index) => (
              <FormControlLabel
                value={person.id}
                control={<Radio />}
                label={person.name + ' ' + person.surname}
                disabled={person.isToBeTransfered}
                key={index}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t('cancel')}
        </Button>
        <Button onClick={onSubmit} color="primary">
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
