import React, { useState, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import { useTranslation } from 'react-i18next';
import styles from './AddParticipantsSection.module.css';
import AddParticipantsDialog from '../../AddParticipantsDialog';

export default function AddParticipantsSection(props) {
  const { otherParticipants, conversationId } = props;
  const { t } = useTranslation();
  const [openAddParticipants, setOpenAddParticipants] = useState(false);

  const closeAddParticipants = () => {
    setOpenAddParticipants(false);
  };

  const handleAddParticipants = () => {
    setOpenAddParticipants(true);
  };

  return (
    <div>
      <div className={styles.addPeople} onClick={handleAddParticipants}>
        <div className={styles.add}>
          <Add />
        </div>
        <Typography className={styles.writing}>{t('add.add_people')}</Typography>
      </div>
      <AddParticipantsDialog
        open={openAddParticipants}
        onClose={closeAddParticipants}
        otherParticipants={otherParticipants}
        conversationId={conversationId}
      />
    </div>
  );
}
