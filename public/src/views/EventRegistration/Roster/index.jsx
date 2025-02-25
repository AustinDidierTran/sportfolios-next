import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { LIST_ITEM_ENUM, ROSTER_ROLE_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import { List } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../hooks/forms';
import styles from './Roster.module.css';
import Typography from '@material-ui/core/Typography';
import api from '../../../actions/api';
import PersonSearchList from '../../../components/Custom/SearchList/PersonSearchList';
import { ACTION_ENUM, Store } from '../../../Store';
import { formatRoute } from '../../../utils/stringFormats';

export default function Roster(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const inputRef = useRef(null);
  const query = useFormInput('');
  const {
    state: { userInfo },
  } = useContext(Store);
  const { stepHook, formik } = props;

  const roster = useMemo(
    () =>
      formik.values.roster.map((p) => ({
        ...p,
        key: p.personId,
        type: LIST_ITEM_ENUM.ROSTER_ITEM,
        onDelete: () => {
          onDelete({ personId: p.personId });
        },
      })),
    [formik.values.roster]
  );

  useEffect(() => {
    // Default behaviour: add creator of team as captain
    if (!formik.values.roster.length) {
      addPerson({
        id: userInfo.primaryPerson.personId,
        completeName: `${userInfo.primaryPerson.name} ${userInfo.primaryPerson.surname}`,
      });
    }
  }, []);

  useEffect(() => {
    stepHook.handleCompleted(2);
  }, []);

  const blackList = useMemo(() => roster.map((r) => r.personId), [roster]);

  const addPerson = async (person) => {
    const role = roster.length === 0 ? ROSTER_ROLE_ENUM.CAPTAIN : ROSTER_ROLE_ENUM.PLAYER;
    if (person.id) {
      const {
        data: { basicInfos: data },
      } = await api(formatRoute('/api/entity', null, { id: person.id }), { method: 'GET' });

      formik.setFieldValue('roster', [
        ...roster,
        {
          personId: person.id,
          name: person.completeName,
          photoUrl: data.photoUrl,
          role,
        },
      ]);
    } else {
      const ids = roster.map((p) => {
        return !isNaN(p.personId) ? p.personId : 0;
      });

      const newId = Math.max(...ids, 0) + 1;
      formik.setFieldValue('roster', [
        ...roster,
        {
          personId: newId,
          name: person.name,
          surname: person.surname,
          email: person.email,
          role,
        },
      ]);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onDelete = (body) => {
    const { personId } = body;
    if (!roster.some((p) => p.role !== ROSTER_ROLE_ENUM.PLAYER && p.personId !== personId)) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team.team_player_role_error'),
        severity: SEVERITY_ENUM.ERROR,
      });
    } else {
      formik.setFieldValue(
        'roster',
        roster.filter((r) => r.personId !== personId)
      );
    }
  };

  return (
    <div className={styles.main}>
      <Typography variant="body2" color="textSecondary" component="p" style={{ marginBottom: '8px' }}>
        {t('roster_selection_message')}
      </Typography>
      <PersonSearchList
        className={styles.item}
        clearOnSelect={false}
        label={t('enter_player_name')}
        onClick={addPerson}
        query={query}
        blackList={blackList}
        secondary={t('player')}
        withoutIcon
        autoFocus
        inputRef={inputRef}
      />
      <hr />
      <Typography style={{ marginTop: '16px' }}>{t('roster')}</Typography>
      {roster.length === 0 ? (
        <Typography style={{ marginBottom: '32px' }}>{t('no.no_roster')}</Typography>
      ) : (
        <div style={{ marginBottom: '16px' }}>
          <List formik={formik} items={roster} />
        </div>
      )}
    </div>
  );
}
