import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../../../../../public/src/Store';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../utils/stringFormats';
import { SEVERITY_ENUM } from '../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../common/errors';
import styles from './PracticeDetailed.module.css';
import CustomIconButton from '../../IconButton';
import Divider from '@material-ui/core/Divider';
import Posts from '../..//Posts';
import moment from 'moment';
import dynamic from 'next/dynamic';
import TextField from '../../TextField';
import { formatDate } from '../../../../utils/stringFormats';
import LoadingSpinner from '../../LoadingSpinner';

const Roster = dynamic(() => import('../../Roster'));

export default function PracticeDetailed(props) {
  const { practiceId, adminView } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { userInfo },
  } = useContext(Store);

  const [isLoading, setIsLoading] = useState(true);
  const [practice, setPractice] = useState({});
  const [address, setAddress] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const getPractice = async () => {
    const { data } = await api(
      formatRoute('/api/entity/practiceInfo', null, {
        practiceId: practiceId,
      }),
      { method: 'GET' }
    );

    if (!data) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
      goBack();
      return;
    }

    setPractice(data);

    let street_address = data.street_address ? data.street_address + ', ' : '';
    let city = data.city ? data.city + ', ' : '';
    let state = data.state ? data.state : '';
    let zip = data.zip ? data.zip + ', ' : ', ';
    let country = data.country ? data.country : '';
    setAddress(street_address + city + state + zip + country);
  };

  useEffect(() => {
    getPractice();
  }, [practiceId]);

  useEffect(() => {
    if (!practice || !practice.entity_id) {
      return;
    }

    setIsLoading(false);
  }, [practice]);

  const goBack = () => {
    history.back();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.root}>
        <div className={styles.baseContent}>
          <div className={styles.header}>
            <div>
              <CustomIconButton size="medium" icon="ArrowBack" style={{ color: 'primary' }} onClick={goBack} />
            </div>
            <div className={styles.practiceInfo}>
              <TextField disabled value={practice.name} variant="h3" />
              <div className={styles.practiceInfoSecondary}>
                <div className={styles.practiceInfoDate}>
                  {moment(practice.start_date).format('dddd Do MMM')}
                  {` ${formatDate(moment(practice.start_date), 'HH:mm')} - ${formatDate(
                    moment(practice.end_date),
                    'HH:mm'
                  )}`}
                </div>
                <div className={styles.practiceInfoSecondary}>
                  <TextField disabled value={practice.location} />
                </div>
                <div className={styles.practiceInfoSecondary}>{address}</div>
              </div>
            </div>

            <div className={styles.iconOptions}>
              {adminView && (
                <CustomIconButton
                  icon="MoreVertIcon"
                  style={{ color: 'primary' }}
                  onClick={handleClick}
                  size="medium"
                />
              )}
            </div>
          </div>
          <Divider variant="middle" />
          <Roster roster={practice.roster} />
          <Divider variant="middle" />
          <Posts
            userInfo={userInfo}
            allowPostImage
            allowNewPost
            entityIdCreatePost={userInfo?.primaryPerson?.entity_id || -1}
            allowComment
            allowLike
            locationId={practice.entity_id}
            elevation={0}
            placeholder={t('write_a_comment')}
          />
        </div>
      </div>
    </div>
  );
}
