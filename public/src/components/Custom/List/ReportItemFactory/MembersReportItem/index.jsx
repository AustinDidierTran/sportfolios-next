import React, { useContext, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { useTranslation } from 'react-i18next';
import {
  formatDate,
  formatPrice,
  formatRoute,
  getMembershipName,
  getPaymentStatusName,
} from '../../../../../utils/stringFormats';
import api from '../../../../../actions/api';
import { REQUEST_STATUS_ENUM, SEVERITY_ENUM } from '../../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../../common/errors';
import moment from 'moment';
import { ACTION_ENUM, Store } from '../../../../../Store';
import AlertDialog from '../../../Dialog/AlertDialog';
import CustomIconButton from '../../../IconButton';
import DownloadReportDialog from '../../../Dialog/DownloadReportDialog';

export default function MembersReportItem(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const { metadata, update, reportId } = props;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);

  const onCancel = () => {
    setOpenDelete(false);
  };

  const onDelete = () => {
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    await api(formatRoute('/api/entity/report', null, { reportId }), { method: 'DELETE' });
    setOpenDelete(false);
    update();
  };

  const handleClick = async () => {
    const res = await api(formatRoute('/api/entity/generateReport', null, { reportId }), { method: 'GET' });
    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
      const formattedData = res.data.map((d) => ({
        name: d.name,
        surname: d.surname,
        membership: getMembershipName(d.memberType),
        price: formatPrice(d.price),
        status: getPaymentStatusName(d.status),
        paidOn: formatDate(moment.utc(d.paidOn), 'YYYY-MM-DD HH:mm'),
        createdAt: formatDate(moment.utc(d.createdAt), 'YYYY-MM-DD HH:mm'),
        expirationDate: formatDate(moment.utc(d.expirationSate), 'YYYY-MM-DD'),
        email: d.email,
        phoneNumber: d.phoneNumber,
        birthDate: d.birthDate,
        gender: t(d.gender),
        address: d.address,
        emergencyName: d.emergencyName,
        emergencySurname: d.emergencySurname,
        emergencyPhoneNumber: d.emergencyPhoneNumber,
        medicalConditions: d.medicalConditions,
        heardOrganization: d.heardOrganization,
        gettingInvolved: d.gettingInvolved ? t('yes') : t('no.no'),
        frequentedSchool: d.frequentedSchool,
        jobTitle: d.jobTitle,
        employer: d.employer,
      }));
      setData(formattedData);
      setOpen(true);
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  };

  const reportName = `${t('member.members_list_on')} ${formatDate(moment.utc(metadata.date))}`;

  const headers = [
    { label: t('name'), key: 'name' },
    { label: t('surname'), key: 'surname' },
    { label: t('member.membership'), key: 'membership' },
    { label: t('price'), key: 'price' },
    { label: t('status'), key: 'status' },
    { label: t('payment.payment_date'), key: 'paidOn' },
    { label: t('create.creation_date'), key: 'createdAt' },
    { label: t('expiration_date'), key: 'expirationDate' },
    { label: t('email.email'), key: 'email' },
    { label: t('phone_number'), key: 'phoneNumber' },
    { label: t('birth_date'), key: 'birthDate' },
    { label: t('gender'), key: 'gender' },
    { label: t('address'), key: 'address' },
    { label: t('emergency_contact'), key: '' },
    { label: t('name'), key: 'emergencyName' },
    { label: t('surname'), key: 'emergencySurname' },
    { label: t('phone_number'), key: 'emergencyPhoneNumber' },
    { label: t('medical_conditions'), key: 'medicalConditions' },
    { label: t('heard_organization'), key: 'heardOrganization' },
    { label: t('getting_involved'), key: 'gettingInvolved' },
    { label: t('frequented_school'), key: 'frequentedSchool' },
    { label: t('job_title'), key: 'jobTitle' },
    { label: t('employer'), key: 'employer' },
  ];

  const fileName = `${metadata.organizationName} ${t('member.members')} ${formatDate(
    moment(metadata.date),
    'YYYY-MM-DD'
  )}.csv`;

  return (
    <>
      <ListItem style={{ width: '100%' }}>
        <ListItemText primary={reportName} />
        <CustomIconButton
          variant="contained"
          icon="GetApp"
          tooltip={t('download_report')}
          style={{ color: 'primary', margin: '8px' }}
          onClick={handleClick}
        />
        <CustomIconButton
          variant="contained"
          icon="Delete"
          tooltip={t('delete.delete')}
          onClick={onDelete}
          style={{ color: 'primary' }}
        />
        <DownloadReportDialog
          fileName={fileName}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          title={t('download_report')}
          data={data}
          headers={headers}
        />
        <AlertDialog
          open={openDelete}
          onCancel={onCancel}
          onSubmit={confirmDelete}
          title={t('delete.delete_report_confirmation')}
        />
      </ListItem>
      <Divider />
    </>
  );
}
