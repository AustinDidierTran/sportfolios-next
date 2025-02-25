import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';
import IgContainer from '../../components/Custom/IgContainer';
import api from '../../actions/api';
import { FORM_DIALOG_TYPE_ENUM } from '../../../common/enums';
import styles from './MembersList.module.css';
import dynamic from 'next/dynamic';
import { formatRoute } from '../../utils/stringFormats';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Store } from '../../Store';
import { useFormInput } from '../../hooks/forms';
import * as organizationService from '../../actions/service/organization';

const ListMembers = dynamic(() => import('./MembersList'));
const CustomPaper = dynamic(() => import('../../components/Custom/Paper'));
const CustomButton = dynamic(() => import('../../components/Custom/Button'));
const CustomFormDialog = dynamic(() => import('../../components/Custom/FormDialog'));
const CustomIconButton = dynamic(() => import('../../components/Custom/IconButton'));

export default function MembersList() {
  const {
    state: { id },
  } = useContext(Store);
  const { t } = useTranslation();

  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const searchQuery = useFormInput('');

  const getEntity = useCallback(async () => {
    if (!id) {
      return;
    }
    const {
      data: { basicInfos: data },
    } = await api(formatRoute('/api/entity', null, { id }), { method: 'GET' });
    setOrganization(data);
  }, [id]);

  const getMembers = useCallback(async () => {
    if (!id) {
      return;
    }

    // const { data, status } = await api(formatRoute('/api/entity/organizationMembers', null, { id }), { method: 'GET' });

    const data = await organizationService.getMembers(id, searchQuery.value);
    const res = data.map((d, index) => ({
      ...d,
      update: getMembers,
      key: index,
    }));
    setMembers(res);
  }, [id, searchQuery.value]);

  useEffect(() => {
    organization
      ? (document.title = formatPageTitle(t('member.members_list', { organization: organization?.name })))
      : '';
  }, [organization]);

  useEffect(() => {
    getEntity();
  }, [getEntity]);

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <IgContainer>
      <CustomPaper
        style={{ textAlign: 'center' }}
        title={t('member.members_list', {
          organization: organization?.name || '',
        })}
      >
        <div className={styles.button}>
          <CustomIconButton
            icon="ArrowBack"
            onClick={() => {
              history.back();
            }}
            tooltip={t('back')}
            style={{ color: 'primary', margin: '8px' }}
          />
          <CustomButton
            size="small"
            variant="contained"
            style={{
              margin: '8px',
              width: 'fit-content',
            }}
            onClick={onOpen}
          >
            {t('add.add_member')}
          </CustomButton>
        </div>
        <TextField placeholder={t('search.title')} {...searchQuery.inputProps} />
        {members.length < 1 ? (
          <Typography color="textSecondary" style={{ margin: '16px' }}>
            {t('no.no_members_message')}
          </Typography>
        ) : (
          <ListMembers items={members} />
        )}
        <CustomFormDialog
          type={FORM_DIALOG_TYPE_ENUM.ADD_MEMBER}
          items={{
            open,
            onClose,
            update: getMembers,
          }}
        />
      </CustomPaper>
    </IgContainer>
  );
}
