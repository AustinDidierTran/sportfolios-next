import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormDialogFactory from './FormDialogFactory';
import ComponentFactory from '../ComponentFactory';

export const DialogPresentation = (props) => {
  const { open, title, children, buttons, formik, onClose } = props;
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth={'xs'} fullWidth>
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <DialogContent>{children}</DialogContent>
          <DialogActions>{buttons}</DialogActions>
        </div>
      </form>
    </Dialog>
  );
};

export default function CustomFormDialog(props) {
  const { items, type } = props;
  if (type) {
    const FormDialog = FormDialogFactory({ type });
    return <FormDialog {...items} />;
  }
  const { open, title, description, buttons, fields, formik, onClose } = props;
  return (
    <DialogPresentation
      open={open}
      title={title}
      buttons={buttons.map((button, index) => (
        <Button onClick={button.onClick} color={button.color} type={button.type} key={index}>
          {button.name}
        </Button>
      ))}
      formik={formik}
      onClose={onClose}
    >
      <>
        {description ? <DialogContentText>{description}</DialogContentText> : null}
        {fields.map((field, index) => (
          <div style={{ marginTop: '8px' }} key={index}>
            <ComponentFactory component={{ ...field, formik }} key={index} />
          </div>
        ))}
      </>
    </DialogPresentation>
    // <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth={'xs'} fullWidth>
    //   <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    //   <form onSubmit={formik.handleSubmit}>
    //     <div>
    //       <DialogContent>

    //       </DialogContent>
    //       <DialogActions>
    //         {buttons.map((button, index) => (
    //           <Button onClick={button.onClick} color={button.color} type={button.type} key={index}>
    //             {button.name}
    //           </Button>
    //         ))}
    //       </DialogActions>
    //     </div>
    //   </form>
    // </Dialog>
  );
}
