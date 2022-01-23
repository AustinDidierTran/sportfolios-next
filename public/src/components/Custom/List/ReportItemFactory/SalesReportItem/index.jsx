import React, { useCallback, useContext, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { useTranslation } from 'react-i18next';
import { formatDate, formatPrice, getPaymentStatusName } from '../../../../../utils/stringFormats';
import { SEVERITY_ENUM } from '../../../../../../common/enums';
import moment from 'moment';
import { ACTION_ENUM, Store } from '../../../../../Store';
import { ERROR_ENUM } from '../../../../../../common/errors';
import AlertDialog from '../../../Dialog/AlertDialog';
import { getProductDetail, getRegistrationFor, getProductName } from '../../../../../utils/Cart';
import CustomIconButton from '../../../IconButton';
import DownloadReportDialog from '../../../Dialog/DownloadReportDialog';
import { deleteReport, generateReport } from '../../../../../actions/service/organization';

export default function ReportItem(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const { metadata, update, reportId, type } = props;
  const [open, setOpen] = useState(false);
  const [reportData, setReportData] = useState({
    data: [],
    headers: [],
  });
  const [openDelete, setOpenDelete] = useState(false);

  const onCancel = () => {
    setOpenDelete(false);
  };

  const onDelete = () => {
    setOpenDelete(true);
  };

  const confirmDelete = useCallback(async () => {
    await deleteReport(reportId);
    setOpenDelete(false);
    update();
  }, [reportId, update]);

  const handleClick = useCallback(async () => {
    try {
      const { data, headers } = await generateReport(reportId);

      console.log({ data });
      const formattedData = data.map((d) => {
        const tempStructure = {};

        Object.keys(d).forEach((dataKey) => {
          const datum = d[dataKey];
          tempStructure[dataKey] = datum.value || t(datum.valueKey);
        });

        return tempStructure;
      });

      console.log({ formattedData });

      setReportData({
        data: formattedData,
        headers: headers.map((header) => ({
          label: header.labelKey ? t(header.labelKey) : header.label,
          key: header.key,
        })),
      });
      setOpen(true);

      return;
      // let sumSubTotal = 0;
      // let sumTotalTax = 0;
      // let sumTotal = 0;
      // let sumPlateformFees = 0;
      // let sumTotalNet = 0;
      // let sumQuantity = 0;
      // const formattedData = data.map((d) => {
      //   sumSubTotal = sumSubTotal + d.subtotal;
      //   sumTotalTax = sumTotalTax + d.totalTax;
      //   sumTotal = sumTotal + d.total;
      //   sumPlateformFees = sumPlateformFees + d.plateformFees;
      //   sumTotalNet = sumTotalNet + d.totalNet;
      //   sumQuantity = sumQuantity + d.quantity;
      //   return {
      //     type: getProductName(d.metadata.type),
      //     detail: getProductDetail(d.metadata),
      //     registrationFor: getRegistrationFor(d.metadata),
      //     status: getPaymentStatusName(d.status),
      //     name: `${d?.name} ${d?.surname}`,
      //     email: d.email,
      //     purchasedOn: formatDate(moment.utc(d.createdAt), 'YYYY-MM-DD HH:mm'),
      //     price: formatPrice(d.unitAmount),
      //     quantity: d.quantity,
      //     subtotal: formatPrice(d.subtotal),
      //     totalTax: formatPrice(d.totalTax),
      //     total: formatPrice(d.total),
      //     plateformFees: formatPrice(d.plateformFees),
      //     totalNet: formatPrice(d.totalNet),
      //   };
      // });
      // const totalRow = {
      //   price: `${t('totals')}:`,
      //   quantity: sumQuantity,
      //   subtotal: formatPrice(sumSubTotal),
      //   totalTax: formatPrice(sumTotalTax),
      //   total: formatPrice(sumTotal),
      //   plateformFees: formatPrice(sumPlateformFees),
      //   totalNet: formatPrice(sumTotalNet),
      // };
      // const emptyRow = {};
      // setData([totalRow, emptyRow, ...formattedData]);
    } catch (err) {
      console.log(err);
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  }, [reportId]);

  // const headers = [
  //   { label: t('type'), key: 'type' },
  //   { label: t('product_detail'), key: 'detail' },
  //   { label: t('register.registration_for'), key: 'registrationFor' },
  //   { label: t('status'), key: 'status' },
  //   { label: t('buyers_name'), key: 'name' },
  //   { label: t('email.email'), key: 'email' },
  //   { label: t('purchased_on'), key: 'purchasedOn' },
  //   { label: t('price'), key: 'price' },
  //   { label: t('quantity'), key: 'quantity' },
  //   { label: t('subtotal'), key: 'subtotal' },
  //   { label: t('tax_total'), key: 'totalTax' },
  //   { label: t('total'), key: 'total' },
  //   { label: t('plateform_fees'), key: 'plateformFees' },
  //   { label: t('total_net'), key: 'totalNet' },
  // ];

  const fileName = `${metadata.organizationName} ${t('sales')} ${formatDate(
    moment.utc(metadata.date),
    'YYYY-MM-DD'
  )}.csv`;

  return (
    <>
      <ListItem style={{ width: '100%' }}>
        <ListItemText primary={t(`reports.${type}`)} secondary={formatDate(moment.utc(metadata.date))} />
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
          data={reportData.data}
          headers={reportData.headers}
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
