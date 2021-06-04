import React, { useContext, useEffect, useState } from 'react';

import moment from 'moment';
import List from '../../../components/Custom/List';
import Paper from '../../../components/Custom/Paper';
import { formatDate, getMembershipName } from '../../../utils/stringFormats';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { formatRoute } from '../../../utils/stringFormats';
import { Store } from '../../../Store';

export default function MyMemberships(props) {
  const { refreshMemberships } = props;
  const { t } = useTranslation();
  const {
    state: { userInfo, id },
  } = useContext(Store);

  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (id) {
      getMembers();
    }
  }, [refreshMemberships, id]);

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
    const expirationDate = formatDate(moment.utc(member.expirationDate));
    return `${t('expire_on')} ${expirationDate}`;
  };

  return (
    <Paper title={t('member.my_memberships')}>
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
        <Typography style={{ padding: '16px' }}>{t('you.you_are_not_a_member_of_this_organization')}</Typography>
      )}
    </Paper>
  );
}
