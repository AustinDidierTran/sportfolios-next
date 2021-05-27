import React, { useEffect, useState, useContext } from 'react';

import api from '../../actions/api';
import { formatRoute } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import PartnerItem from './PartnerItem';
import Typography from '@material-ui/core/Typography';
import { Store } from '../../Store';

export default function Partners() {
  const { t } = useTranslation();

  const {
    state: { userInfo, id },
  } = useContext(Store);

  const [partners, setPartners] = useState([]);

  useEffect(() => {
    if (id && userInfo) {
      getPartners();
    }
  }, [id, userInfo]);

  const getPartners = async () => {
    const res = await api(formatRoute('/api/entity/partners', null, { id }));

    const data = res.data.map((d) => ({
      name: d.name,
      website: d.website,
      description: d.description,
      photoUrl: d.photo_url,
      id: d.id,
      key: d.id,
    }));
    setPartners(data);
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
