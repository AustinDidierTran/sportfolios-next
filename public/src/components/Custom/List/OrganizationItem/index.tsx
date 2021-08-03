import React, { useCallback } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../actions/goTo';
import CustomAvatar from '../../Avatar';

interface IProps {
  id: string;
  onClick: (e: any, values: { id: string; name: string }) => void;
  selected: boolean;
  photoUrl: string;
  name: string;
}

const OrganizationItem: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { id, onClick, selected, photoUrl, name } = props;

  const handleClick = useCallback(
    (e) => {
      if (onClick) {
        onClick(e, { id, name });
      } else {
        goTo(ROUTES.entity, { id });
      }
    },
    [id, onClick]
  );

  return (
    <ListItem button onClick={handleClick} selected={selected} style={{ width: '100%' }}>
      <ListItemIcon>
        <CustomAvatar photoUrl={photoUrl} />
      </ListItemIcon>
      <ListItemText primary={name} secondary={t('organization')}></ListItemText>
    </ListItem>
  );
};
export default OrganizationItem;
