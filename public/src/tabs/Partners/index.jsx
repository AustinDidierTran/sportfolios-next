import React, { useEffect, useState, useMemo } from 'react';

import { useRouter } from 'next/router';
import api from '../../actions/api';
import { formatRoute } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import PartnerItem from './PartnerItem';

export default function Partners() {
  const { t } = useTranslation();

  const router = useRouter();
  const { id } = router.query;

  const [partners, setPartners] = useState([]);

  useEffect(() => {
    getPartners();
  }, [id]);

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

  return (
    <div>
      {partners.map((p) => (
        <PartnerItem key={p.id} {...p} />
      ))}
    </div>
  );
}
