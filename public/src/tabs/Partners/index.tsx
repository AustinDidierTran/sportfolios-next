import React, { useEffect, useState, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import PartnerItem from './PartnerItem';
import Typography from '@material-ui/core/Typography';
import { Store } from '../../Store';
import { getPartners as getPartnersApi } from '../../actions/service/entity/get';
import { Partner } from '../../../../typescript/types';

interface IPartners extends Partner {
  key: string;
}

export default function Partners() {
  const { t } = useTranslation();

  const {
    state: { userInfo, id },
  } = useContext(Store);

  const [partners, setPartners] = useState<IPartners[]>([]);

  useEffect(():void => {
    if (id && userInfo) {
      getPartners();
    }
  }, [id, userInfo]);

  const getPartners = async ():Promise<void> => {
    const data = await getPartnersApi(id);

    const partners = data.map((d) => ({
      name: d.name,
      website: d.website,
      description: d.description,
      photoUrl: d.photoUrl,
      id: d.id,
      key: d.id,
    }));
    setPartners(partners);
  };

  if (!partners.length) {
    return (
      <Typography color="textSecondary" style={{ margin: '16px' }}>
        {t('no.no_partners')}
      </Typography>
    );
  }

  return (
    <div>
      {partners.map((p) => (
        <PartnerItem key={p.id} {...p} />
      ))}
    </div>
  );
}
