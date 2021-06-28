import React, { useContext, useEffect, useState } from 'react';

import moment from 'moment';
import List from '../../../components/Custom/List';
import Paper from '../../../components/Custom/Paper';
import { formatDate, getMembershipName } from '../../../utils/stringFormats';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { Store } from '../../../Store';
import {getEntity, getMembers as getMembersApi} from '../../../actions/service/entity/get';
import { Entity, InvoiceStatus, Member } from '../../../../../typescript/types';

interface IProps {
  refreshMemberships: boolean;
}

interface IMembers {
  items?: Items;
  person?: IPerson;
}

interface IPerson {
  basicInfos: Entity;
  completeName: string;
  type: number;
  key: string;
}

interface Items {
  primary: string;
  secondary: string;
  status: InvoiceStatus;
  type: string;
  key: number;
}

const MyMemberships: React.FunctionComponent<IProps> = (props) => {
  const { refreshMemberships } = props;
  const { t } = useTranslation();
  const {
    state: { userInfo, id },
  } = useContext(Store);

  const [members, setMembers] = useState<IMembers[]>([]);

  useEffect(():void => {
    if (id) {
      getMembers();
    }
  }, [refreshMemberships, id]);

  const getMembers = async ():Promise<void> => {
    if (!userInfo.persons) {
      return;
    }
    const members:IMembers[] = await Promise.all(
      userInfo.persons.map(async (p:Member) => {
        const data = await getMembersApi(id, p.personId);
        if (data.length) {
          const person = await getEntity(p.personId);
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
                ...person,
                completeName: `${person?.name} ${person?.surname}`,
                type: GLOBAL_ENUM.PERSON,
                key: person?.id,
              },
            ],
          };
        }
      })
    );
    const res = members.filter((m) => m);
    setMembers(res);
  };

  const getPrimary = (member:Member): string => {
    const name = t(getMembershipName(member.memberType));
    return name;
  };

  const getSecondary = (member:Member): string => {
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
export default MyMemberships;