import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Paper, Button, FormDialog, List } from '../../../components/Custom';
import { formatDate, getMembershipName } from '../../../utils/stringFormats';
import { FORM_DIALOG_TYPE_ENUM, GLOBAL_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { Store } from '../../../Store';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { useRouter } from 'next/router';
import { formatRoute } from '../../../../common/utils/stringFormat';

export default function Memberships(props) {
  const { disableButton = false, refreshMemberships } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [open, setOpen] = useState(false);
  const {
    state: { userInfo },
  } = useContext(Store);

  const [members, setMembers] = useState([]);
  const [hasMemberships, setHasMemberships] = useState(false);

  useEffect(() => {
    getMembers();
    getHasMemberships();
  }, [refreshMemberships]);

  const getHasMemberships = async () => {
    const { data } = await api(
      formatRoute('/api/entity/hasMemberships', null, {
        id,
      })
    );
    setHasMemberships(data);
  };

  const getMembers = async () => {
    if (!userInfo.persons) {
      return;
    }
    const members = await Promise.all(
      userInfo.persons.map(async (p) => {
        const { data } = await api(
          formatRoute('/api/entity/members', null, {
            id,
            personId: p.entity_id,
          })
        );
        if (data.length) {
          const person = await api(
            formatRoute('/api/entity', null, {
              id: p.entity_id,
            })
          );
          const items = await Promise.all(
            data.map((d, index) => ({
              primary: getPrimary(d),
              secondary: getSecondary(d),
              status: d.status,
              type: GLOBAL_ENUM.MEMBERSHIP,
              key: index,
            }))
          );
          return {
            items,
            person: [
              {
                ...person.data?.basicInfos,
                completeName: `${person.data?.basicInfos?.name} ${person.data?.basicInfos?.surname}`,
                type: GLOBAL_ENUM.PERSON,
                key: person.data?.basicInfos.id,
              },
            ],
          };
        }
      })
    );
    const res = members.filter((m) => m);
    setMembers(res);
  };

  const getPrimary = (member) => {
    const name = t(getMembershipName(member.memberType));
    return name;
  };

  const getSecondary = (member) => {
    const expirationDate = formatDate(moment(member.expirationDate));
    return `${t('expire_on')} ${expirationDate}`;
  };

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      {hasMemberships && !disableButton && (
        <Button size="small" variant="contained" style={{ margin: '8px' }} onClick={onOpen}>
          {t('become_member')}
        </Button>
      )}
      { !hasMemberships && (
        <Typography style={{ margin: '16px' }}>{t('this_organization_has_no_memberships_available')}</Typography>
      )}
      <Paper title={t('member.memberships')}>
        <FormDialog
          type={FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER}
          items={{
            open,
            onClose,
            update: getMembers,
          }}
        />
        {members.length ? (
          <>
            {members.map((m, index) => (
              <div key={index}>
                <List items={m.person} />
                <List key={index} items={m.items} />
                <Divider />
              </div>
            ))}
          </>
        ) : (
          <Typography style={{ margin: '16px' }}>{t('you.you_are_not_a_member_of_this_organization')}</Typography>
        )}
      </Paper>
    </>
  );
}
