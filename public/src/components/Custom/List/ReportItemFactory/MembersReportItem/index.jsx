import React, { useContext, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { useTranslation } from 'react-i18next';
import { formatDate, formatPrice } from '../../../../../utils/stringFormats';
import api from '../../../../../actions/api';
import { INVOICE_STATUS_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../../common/errors';
import moment from 'moment';
import { ACTION_ENUM, Store } from '../../../../../Store';
import { getMembershipName } from '../../../../../../common/functions';
import { formatRoute } from '../../../../../../common/utils/stringFormat';
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
    await api(
      formatRoute('/api/entity/report', null, {
        reportId,
      }),
      {
        method: 'DELETE',
      }
    );
    setOpenDelete(false);
    update();
  };

  const getStatusName = (status) => {
    switch (status) {
      case INVOICE_STATUS_ENUM.OPEN:
        return t('payment.not_paid');
      case INVOICE_STATUS_ENUM.PAID:
        return t('payment.paid');
      default:
        return '';
    }
  };

  const handleClick = async () => {
    const res = await api(formatRoute('/api/entity/generateReport', null, { reportId }));

    if (res.status === STATUS_ENUM.SUCCESS_STRING) {
      const formattedData = res.data.map((d) => ({
        name: d.name,
        surname: d.surname,
        membership: t(getMembershipName(d.member_type)),
        price: formatPrice(d.price),
        status: getStatusName(d.status),
        paidOn: formatDate(moment(d.paid_on), 'YYYY-MM-DD HH:mm'),
        createdAt: formatDate(moment(d.created_at), 'YYYY-MM-DD HH:mm'),
        expirationDate: formatDate(moment(d.expiration_date), 'YYYY-MM-DD'),
        email: d.email,
        phoneNumber: d.phone_number,
        birthDate: d.birth_date,
        gender: t(d.gender),
        city: d.city,
        state: d.state,
        zip: d.zip,
        emergencyName: d.emergency_name,
        emergencySurname: d.emergency_surname,
        emergencyPhoneNumber: d.emergency_phone_number,
        medicalConditions: d.medical_conditions,
        heardOrganization: d.heard_organization,
        gettingInvolved: d.getting_involved ? t('yes') : t('no.no'),
        frequentedSchool: d.frequented_school,
        jobTitle: d.job_title,
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

  const reportName = `${t('member.members_list_on')} ${formatDate(moment(metadata.date))}`;

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
    { label: t('city'), key: 'city' },
    { label: t('state'), key: 'state' },
    { label: t('zip_code'), key: 'zip' },
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
        <ListItemText primary={reportName}></ListItemText>
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
