import React, { useContext, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import Paper from '../../components/Custom/Paper';
import Button from '../../components/Custom/Button';
import AlertDialog from '../../components/Custom/Dialog/AlertDialog';
import IgContainer from '../../components/Custom/IgContainer';
import List from './MembersImportList';
import ContainerBottomFixed from '../../components/Custom/ContainerBottomFixed';
import Select from '../../components/Custom/Select';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import FormDialog from '../../components/Custom/FormDialog';
import { useTranslation } from 'react-i18next';
import { ExcelRenderer } from 'react-excel-renderer';
import { ACTION_ENUM, Store } from '../../Store';
import { LIST_ITEM_ENUM, SEVERITY_ENUM, REQUEST_STATUS_ENUM, FORM_DIALOG_TYPE_ENUM } from '../../../common/enums';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useFormik } from 'formik';
import styles from './ImportMembers.module.css';
import { formatRoute, getMembershipName, validateDateWithYear, validateEmail } from '../../utils/stringFormats';
import api from '../../actions/api';
import moment from 'moment';
import { ERROR_ENUM } from '../../../common/errors';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CouponRow from './CouponRow';
import CouponRowMobile from './CouponRowMobile';
import { MOBILE_WIDTH } from '../../../common/constants';
import { useWindowSize } from '../../hooks/window';
import CustomIconButton from '../../components/Custom/IconButton';
import { goBack } from '../../../../public/src/actions/goTo';

export default function ImportMembers() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id },
  } = useContext(Store);
  const [isLoading, setIsLoading] = useState();
  const [coupons, setCoupons] = useState([]);
  const [width] = useWindowSize();

  useEffect(() => {
    if (id) {
      getMemberships();
      getCoupons();
    }
  }, [id]);

  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  const update = () => {
    getMemberships();
  };

  const getCoupons = async () => {
    const { data } = await api(formatRoute('/api/entity/organizationTokenPromoCode', null, { id }), { method: 'GET' });

    if (data) {
      setCoupons(data);
    }
  };

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
      maxWidth: 55,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  const getMemberships = async () => {
    const res = await api(formatRoute('/api/entity/memberships/', null, { id }), { method: 'GET' });
    if (!res.data) {
      return;
    }
    const data = res.data.reduce((prev, curr) => {
      if (!prev.some((p) => p.value === curr.membershipType)) {
        const res = {
          display: getMembershipName(curr.membershipType),
          value: curr.membershipType,
        };
        prev.push(res);
      }
      return prev;
    }, []);
    formik.setFieldValue('memberships', data);
    if (data[0]) {
      formik.setFieldValue('membership', data[0].value);
    }
  };

  const formik = useFormik({
    initialValues: {
      members: [],
      fileName: '',
      dialogOpen: false,
      memberships: '',
      membership: '',
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { members, membership } = values;
      const language = localStorage.getItem('i18nextLng');
      const res = await api(formatRoute(`/api/entity/importMembers`, null, null), {
        method: 'POST',
        body: JSON.stringify({
          membershipType: membership,
          organizationId: id,
          language,
          members: members.map((m) => {
            const expirationDate = moment();
            expirationDate.set('year', m.year);
            expirationDate.set('month', m.month - 1);
            expirationDate.set('date', m.day);
            return { email: m.email, expirationDate };
          }),
        }),
      });
      if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
        formik.setFieldValue('dialogOpen', false);
        formik.setFieldValue('members', []);

        getCoupons();
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('transfer_completed'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 3000,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 3000,
        });
      }
    },
  });

  const fileHandler = async (event) => {
    if (!event?.target.files.length) {
      return;
    }
    let fileObj = event?.target?.files[0];
    if (fileObj.type != 'text/csv') {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('invalid.invalid_file_format_csv'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 5000,
      });
      return;
    }
    setIsLoading(true);
    formik.setFieldValue('fileName', fileObj.name);
    await ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: err,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        resp.rows.splice(0, 2);
        const rows = resp.rows.map((r, index) => ({
          email: r[0],
          day: r[1],
          month: r[2],
          year: r[3],
          type: LIST_ITEM_ENUM.MEMBER_IMPORT,
          key: index,
        }));
        const tempMembers = formik.values.members;
        rows.forEach((r) => {
          if (!tempMembers.some((m) => r.email === m.email)) {
            tempMembers.push(r);
          }
        });
        formik.setFieldValue('members', tempMembers);
      }
    });
    setIsLoading(false);
  };

  const completeTransfer = () => {
    const incorrectMembers = formik.values.members.reduce((prev, curr) => {
      if (!validateEmail(curr.email) || !validateDateWithYear(`${curr.day}/${curr.month}/${curr.year}`)) {
        return prev + 1;
      }
      return prev;
    }, 0);
    if (!formik.values.memberships.length) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('you.you_need_to_have_a_membership_available'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 5000,
      });
      return;
    }
    if (incorrectMembers > 0) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('you.you_still_have_x_members_with_incorrect_information', {
          incorrectMembers,
        }),
        severity: SEVERITY_ENUM.ERROR,
        duration: 5000,
      });
      return;
    }
    formik.setFieldValue('dialogOpen', true);
  };

  const headers = [
    { label: '', key: 'emails' },
    { label: t('member.member_expiration_date'), key: 'day' },
    { label: '', key: 'month' },
    { label: '', key: 'year' },
  ];
  const dataTemplate = [
    {
      emails: t('email.emails'),
      day: t('day'),
      month: t('month'),
      year: t('year'),
    },
  ];

  const { dialogOpen, members, memberships } = formik.values;

  return (
    <IgContainer>
      <Paper title={t('import_members')}>
        <div className={styles.header}>
          <CustomIconButton
            icon="ArrowBack"
            onClick={() => goBack()}
            tooltip={t('return_organization')}
            className={styles.iconButton}
            style={{ color: 'primary' }}
          />
        </div>
        <ListItem className={styles.listItem}>
          <ListItemText primary={t('step_1')} secondary={t('download_excel_template')} />
          <CSVLink
            data={dataTemplate}
            headers={headers}
            style={{ textDecoration: 'none' }}
            filename={t('import_members') + '.csv'}
          >
            <Button variant="outlined" endIcon="GetApp" style={{ margin: '8px' }}>
              {t('download')}
            </Button>
          </CSVLink>
        </ListItem>
        <ListItem className={styles.listItem}>
          <ListItemText primary={t('step_2')} secondary={t('import_your_excel_sheet_with_all_your_members')} />
          <Button
            variant="outlined"
            endIcon="CloudUploadIcon"
            component="label"
            className={styles.button2}
            style={{ margin: '8px' }}
          >
            {t('import')}
            <input type="file" onChange={fileHandler} hidden />
          </Button>
        </ListItem>
        <ListItem className={styles.listItem}>
          <ListItemText primary={t('step_3')} secondary={t('choose.choose_membership')} />
          <div className={styles.div}>
            {memberships.length ? (
              <Select
                options={memberships}
                namespace="membership"
                autoFocus
                margin="dense"
                label={t('member.membership')}
                formik={formik}
              />
            ) : (
              <Button
                className={styles.button3}
                variant="outlined"
                endIcon="Add"
                component="label"
                onClick={() => {
                  setOpen(true);
                }}
                style={{ margin: '8px' }}
              >
                {t('add.add_membership')}
              </Button>
            )}
          </div>
        </ListItem>
      </Paper>
      <div>
        <Button
          onClick={() => {
            location.reload();
          }}
          style={{ margin: 8 }}
          endIcon="Replay"
        >
          {t('reset')}
        </Button>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ marginBottom: 14 }}>
          <List items={members} formik={formik} />
        </div>
      )}
      <Paper title={t('coupons_sent_list')} className={styles.paper}>
        <TableContainer component={Paper}>
          {width < MOBILE_WIDTH ? (
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>{t('email.email')}</StyledTableCell>
                  <StyledTableCell>{t('code')}</StyledTableCell>
                  <StyledTableCell align="center">{t('status')}</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons?.length > 0 ? (
                  <>
                    {coupons.map((coupon, index) => (
                      <CouponRowMobile coupon={coupon} key={index} />
                    ))}
                  </>
                ) : (
                  <StyledTableRow>
                    <StyledTableCell align="center" colSpan={4}>
                      {t('no.no_coupons_sent')}
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>{t('email.email')}</StyledTableCell>
                  <StyledTableCell>{t('code')}</StyledTableCell>
                  <StyledTableCell align="center">{t('status')}</StyledTableCell>
                  <StyledTableCell>{t('expiration_date')}</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons?.length > 0 ? (
                  <>
                    {coupons.map((coupon, index) => (
                      <CouponRow coupon={coupon} key={index} />
                    ))}
                  </>
                ) : (
                  <StyledTableRow>
                    <StyledTableCell align="center" colSpan={4}>
                      {t('no.no_coupons_sent')}
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>
      <AlertDialog
        open={dialogOpen}
        onCancel={() => {
          formik.setFieldValue('dialogOpen', false);
        }}
        title={t('complete_transfer')}
        description={t('import_members_confirmation', {
          membersAmount: members.length || '',
          membershipName: getMembershipName(formik.values.membership),
        })}
        onSubmit={formik.handleSubmit}
      />
      <ContainerBottomFixed>
        <Button onClick={completeTransfer} style={{ margin: 8 }}>
          {t('complete_transfer')}
        </Button>
      </ContainerBottomFixed>
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.ADD_MEMBERSHIP}
        items={{
          open,
          onClose,
          update,
        }}
      />
    </IgContainer>
  );
}
