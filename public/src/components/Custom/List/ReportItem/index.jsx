import React, { useCallback, useContext, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../../utils/stringFormats';
import { SEVERITY_ENUM } from '../../../../../common/enums';
import moment from 'moment';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../common/errors';
import AlertDialog from '../../Dialog/AlertDialog';
import CustomIconButton from '../../IconButton';
import DownloadReportDialog from '../../Dialog/DownloadReportDialog';
import { getReport } from '../../../../actions/service/report';
import { deleteReport } from '../../../../actions/service/organization';

export default function ReportItem(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const { metadata, update, reportId, type } = props;
  const [open, setOpen] = useState(false);
  const [reportData, setReportData] = useState({
    fileName: '',
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
      const { data, fileName, headers } = await getReport(reportId);

      const formattedData = data.map((d) => {
        const tempStructure = {};

        Object.keys(d).forEach((dataKey) => {
          const datum = d[dataKey];
          tempStructure[dataKey] = datum.value || t(datum.valueKey);
        });

        return tempStructure;
      });

      setReportData({
        data: formattedData,
        fileName,
        headers: headers.map((header) => ({
          label: header.labelKey ? t(header.labelKey) : header.label,
          key: header.key,
        })),
      });
      setOpen(true);

      return;
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  }, [reportId]);

  return (
    <>
      <ListItem style={{ width: '100%' }}>
        <ListItemText primary={t(`reports.${type}.title`)} secondary={formatDate(moment.utc(metadata.date))} />
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
          fileName={reportData.fileName}
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
