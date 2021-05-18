import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';
import IgContainer from '../../components/Custom/IgContainer';
import api from '../../actions/api';
import { goToAndReplace, ROUTES } from '../../actions/goTo';
import { FORM_DIALOG_TYPE_ENUM, STATUS_ENUM } from '../../../common/enums';
import styles from './MembersList.module.css';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { formatRoute } from '../../utils/stringFormats';
import Typography from '@material-ui/core/Typography';

const ListMembers = dynamic(() => import('./MembersList'));
const CustomPaper = dynamic(() => import('../../components/Custom/Paper'));
const CustomButton = dynamic(() => import('../../components/Custom/Button'));
const CustomFormDialog = dynamic(() => import('../../components/Custom/FormDialog'));
const CustomIconButton = dynamic(() => import('../../components/Custom/IconButton'));

export default function MembersList() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();

  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    organization
      ? (document.title = formatPageTitle(t('member.members_list', { organization: organization?.name })))
      : '';
  }, [organization]);

  useEffect(() => {
    if (id) {
      getEntity();
      getMembers();
    }
  }, [id]);

  const getEntity = async () => {
    const {
      data: { basicInfos: data },
    } = await api(formatRoute('/api/entity', null, { id }));
    setOrganization(data);
  };

  const getMembers = async () => {
    const { data, status } = await api(formatRoute('/api/entity/organizationMembers', null, { id }));
    if (status === STATUS_ENUM.ERROR_STRING) {
      goToAndReplace(ROUTES.entityNotFound);
    } else {
      const res = data.map((d, index) => ({
        ...d,
        update: getMembers,
        key: index,
      }));
      setMembers(res);
    }
  };

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
