import React, { useState, useEffect } from 'react';
import styles from './GameDetailed.module.css';
import { SELECT_ENUM } from '../../../../common/enums';
import api from '../../../actions/api';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../../components/Custom';
import { useRouter } from 'next/router';

export default function GameDetailed() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;

  useEffect(() => {
    // getGames();
  }, [eventId]);

  return <>Afficher une game</>;
}
