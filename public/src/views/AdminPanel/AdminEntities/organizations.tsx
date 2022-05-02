import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CustomAvatar from '../../../components/Custom/Avatar';
import Delete from '@material-ui/icons/Delete';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import Restore from '@material-ui/icons/Restore';
import Button from '@material-ui/core/Button';
import { useFormInput } from '../../../hooks/forms';
import { Organization } from '../../../../../typescript/entity';
import {
  getAllTheOrganizations,
  deleteOrganization,
  verifyOrganization,
} from '../../../actions/service/organization/admin';
import styles from '../AdminEntitiesView.module.css';
import CustomButton from '../../../components/Custom/Button';

const ORGANIZATION_LIMIT = 10;

const Organizations: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationCount, setOrganizationCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const organizationSearchQuery = useFormInput('');

  const pageAmount = useMemo(
    () => Math.ceil(organizationCount / ORGANIZATION_LIMIT),
    [organizationCount, ORGANIZATION_LIMIT]
  );

  const updateOrganizations = useCallback(() => {
    getAllTheOrganizations(ORGANIZATION_LIMIT, page, organizationSearchQuery.value).then((res) => {
      setOrganizations(res.organizations);
      setOrganizationCount(res.count);
    });
  }, [ORGANIZATION_LIMIT, page, organizationSearchQuery.value]);

  const onOrganizationDelete = useCallback((id, restore) => {
    deleteOrganization(id, restore).then(() => updateOrganizations());
  }, []);

  const onVerifyOrganization = useCallback((id, verify) => {
    verifyOrganization(id, !verify).then(() => updateOrganizations());
  }, []);

  useEffect(() => {
    updateOrganizations();
  }, [updateOrganizations]);

  return (
    <Paper className={styles.card}>
      <Typography gutterBottom variant="h5" component="h2">
        {t('organizations')}
      </Typography>
      <TextField {...organizationSearchQuery.inputProps} placeholder={t('search.title')} />
      <div className={styles.paging}>
        <Button startIcon={<ArrowBackIosRoundedIcon />} onClick={() => setPage((page) => Math.max(1, page - 1))} />
        <span>
          Page {page} of {pageAmount}
        </span>
        <Button
          endIcon={<ArrowForwardIosRoundedIcon />}
          onClick={() => setPage((page) => Math.min(pageAmount, page + 1))}
        />
      </div>
      <List>
        {organizations?.map((t: Organization, index: number) => (
          <React.Fragment key={index}>
            <ListItem>
              <CustomAvatar photoUrl={t.photoUrl} />
              <ListItemText primary={t.name} />
              <CustomButton
                onClick={() => onVerifyOrganization(t.id, Boolean(t.verifiedAt))}
                variant={t.verifiedAt ? 'outlined' : 'contained'}
                endIcon={t.verifiedAt ? 'Check' : null}
              >
                {!t.verifiedAt ? 'Verify' : 'Verified'}
              </CustomButton>
              <IconButton edge="end" onClick={() => onOrganizationDelete(t.id, Boolean(t.deletedAt))}>
                {t.deletedAt ? <Restore /> : <Delete />}
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default Organizations;
