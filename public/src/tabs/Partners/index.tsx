import React, { useEffect, useState, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import PartnerItem from './PartnerItem';
import Typography from '@material-ui/core/Typography';
import { Store } from '../../Store';
import { getPartners as getPartnersApi } from '../../actions/service/entity/get';
import { Partner } from '../../../../typescript/types';

const Partners: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const {
    state: { userInfo, id },
  } = useContext(Store);

  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect((): void => {
    if (id && userInfo) {
      getPartners();
    }
  }, [id, userInfo]);

  const getPartners = (): void => {
    getPartnersApi(id).then(setPartners);
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
};
export default Partners;
