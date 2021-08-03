import React, { useContext, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { useTranslation } from 'react-i18next';
import { formatDate, formatPrice, formatRoute, getPaymentStatusName } from '../../../../../utils/stringFormats';
import api from '../../../../../actions/api';
import { SEVERITY_ENUM } from '../../../../../../common/enums';
import moment from 'moment';
import { ACTION_ENUM, Store } from '../../../../../Store';
import { ERROR_ENUM } from '../../../../../../common/errors';
import AlertDialog from '../../../Dialog/AlertDialog';
import { getProductDetail, getRegistrationFor, getProductName } from '../../../../../utils/Cart';
import CustomIconButton from '../../../IconButton';
import DownloadReportDialog from '../../../Dialog/DownloadReportDialog';

export default function ReportItem(props) {
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
    //Change it to  if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
    if (res.status === 201) {
      let sumSubTotal = 0;
      let sumTotalTax = 0;
      let sumTotal = 0;
      let sumPlateformFees = 0;
      let sumTotalNet = 0;
      let sumQuantity = 0;
      const formattedData = res.data.map((d) => {
        sumSubTotal = sumSubTotal + d.subtotal;
        sumTotalTax = sumTotalTax + d.totalTax;
        sumTotal = sumTotal + d.total;
        sumPlateformFees = sumPlateformFees + d.plateformFees;
        sumTotalNet = sumTotalNet + d.totalNet;
        sumQuantity = sumQuantity + d.quantity;
        return {
          type: getProductName(d.metadata.type),
          detail: getProductDetail(d.metadata),
          registrationFor: getRegistrationFor(d.metadata),
          status: getPaymentStatusName(d.status),
          name: `${d?.name} ${d?.surname}`,
          email: d.email,
          purchasedOn: formatDate(moment.utc(d.createdAt), 'YYYY-MM-DD HH:mm'),
          price: formatPrice(d.unitAmount),
          quantity: d.quantity,
          subtotal: formatPrice(d.subtotal),
          totalTax: formatPrice(d.totalTax),
          total: formatPrice(d.total),
          plateformFees: formatPrice(d.plateformFees),
          totalNet: formatPrice(d.totalNet),
        };
      });
      const totalRow = {
        price: `${t('totals')}:`,
        quantity: sumQuantity,
        subtotal: formatPrice(sumSubTotal),
        totalTax: formatPrice(sumTotalTax),
        total: formatPrice(sumTotal),
        plateformFees: formatPrice(sumPlateformFees),
        totalNet: formatPrice(sumTotalNet),
      };
      const emptyRow = {};
      setData([totalRow, emptyRow, ...formattedData]);
      setOpen(true);
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  };
  const reportName = `${t('sales_on')} ${formatDate(moment.utc(metadata.date))}`;

  const headers = [
    { label: t('type'), key: 'type' },
    { label: t('product_detail'), key: 'detail' },
    { label: t('register.registration_for'), key: 'registrationFor' },
    { label: t('status'), key: 'status' },
    { label: t('buyers_name'), key: 'name' },
    { label: t('email.email'), key: 'email' },
    { label: t('purchased_on'), key: 'purchasedOn' },
    { label: t('price'), key: 'price' },
    { label: t('quantity'), key: 'quantity' },
    { label: t('subtotal'), key: 'subtotal' },
    { label: t('tax_total'), key: 'totalTax' },
    { label: t('total'), key: 'total' },
    { label: t('plateform_fees'), key: 'plateformFees' },
    { label: t('total_net'), key: 'totalNet' },
  ];

  const fileName = `${metadata.organizationName} ${t('sales')} ${formatDate(
    moment.utc(metadata.date),
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
      </ListItem>
      <AlertDialog
        open={openDelete}
        onCancel={onCancel}
        onSubmit={confirmDelete}
        title={t('delete.delete_report_confirmation')}
      />
      <Divider />
    </>
  );
}
