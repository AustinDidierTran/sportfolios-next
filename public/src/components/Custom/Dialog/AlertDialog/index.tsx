import React from 'react';
import CustomDialog from '..';
import { useTranslation } from 'react-i18next';

interface IProps {
  open?: boolean;
  title?: string;
  description?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  onSubmitText?: string;
  onCancelText?: string;
}

const AlertDialog: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const {
    open,
    title = t('action_confirmation'),
    description = '',
    onSubmit,
    onCancel,
    onSubmitText = t('confirm'),
    onCancelText = t('cancel'),
  } = props;

  const buttons = [
    {
      onClick: onCancel,
      name: onCancelText,
      color: 'secondary',
    },
    {
      onClick: onSubmit,
      type: 'submit',
      name: onSubmitText,
      color: 'primary',
    },
  ];

  return <CustomDialog open={open} title={title} description={description} buttons={buttons} onClose={onCancel} />;
};
export default AlertDialog;
