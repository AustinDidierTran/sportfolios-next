import React from 'react';

import ListItemText from '@material-ui/core/ListItemText';
import TextField from '../TextField';
import Button from '../Button';
import Select from '../Select';
import MultiSelect from '../MultiSelect';
import Avatar from '../Avatar';
import AddressSearchInput from '../AddressSearchInput';
import CheckBox from '../CheckBox';
import RadioGroup from '../RadioGroup';
import CustomIconButton from '../IconButton';
import PhoneNumberFormat from '../PhoneNumberFormat';
import CustomLocations from '../Locations';
import CustomExercises from '../Exercise/ExerciseComponent';

import { COMPONENT_TYPE_ENUM } from '../../../../common/enums';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonSearchList from '../SearchList/PersonSearchList';
import PersonItem from '../List/PersonItem';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Upload from 'rc-upload';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';

export default function ComponentFactory(props) {
  const { component } = props;
  if (component.componentType === COMPONENT_TYPE_ENUM.SELECT) {
    return (
      <Select
        options={component.options}
        formik={component.formik}
        onChange={component.onChange}
        namespace={component.namespace}
        label={component.label}
        value={component.defaultValue}
        style={component.style}
        showtextifonlyoneoption={component?.showTextIfOnlyOneOption?.toString() || 'false'}
        disabled={component.disabled}
        key={component.key}
        required={component.required}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.MULTISELECT) {
    return (
      <MultiSelect
        formik={component.formik}
        label={component.label}
        options={component.options}
        values={component.values}
        onChange={component.onChange}
        style={component.style}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.ADDRESS) {
    return (
      <AddressSearchInput
        formik={component.formik}
        namespace={component.namespace}
        language={component.language}
        country={component.country}
        addressChanged={component.addressChanged}
        errorFormat={component.errorFormat}
        onChange={component.onChange}
        noValidate={component.noValidate}
        placeholder={component.placeholder}
        required={component.required}
        hidden={component.hidden}
      >
        {component.children}
      </AddressSearchInput>
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.BUTTON) {
    return (
      <Button
        namespace={component.namespace}
        endIcon={component.endIcon}
        onClick={component.onClick}
        style={component.style}
        variant={component.variant}
        color={component.color}
        disabled={component.disabled}
      >
        {component.children}
      </Button>
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.CHECKBOX) {
    return (
      <CheckBox
        checked={component.checked}
        onChange={component.onChange}
        label={component.label}
        namespace={component.namespace}
        color={component.color}
        name={component.name}
        tooltip={component.tooltip}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.PHONE_NUMBER) {
    return (
      <TextField
        InputProps={{
          inputComponent: PhoneNumberFormat,
        }}
        namespace={component.namespace}
        formik={component.formik}
        helperText={component.helperText}
        label={component.label}
        onChange={component.onChange}
        className={component.className}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.LIST_ITEM) {
    return (
      <ListItemText
        primary={component.primary}
        primaryTypographyProps={component.primaryTypographyProps}
        secondary={component.secondary}
        secondaryTypographyProps={component.secondaryTypographyProps}
        style={{ overflowWrap: 'anywhere' }}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.DIVIDER) {
    return <Divider style={component.style} />;
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.LIST) {
    return (
      <List>
        <ListItem>
          <ListItemText
            primary={component.primary}
            secondary={component.secondary}
            style={{ overflowWrap: 'anywhere' }}
          />
          <ListItemSecondaryAction>
            <CustomIconButton
              icon={component.icon}
              style={{ color: 'primary', marginLeft: 'auto' }}
              onClick={component.onIconClick}
              tooltip={component.tooltip}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.PERSON_SEARCH_LIST) {
    return (
      <PersonSearchList
        clearOnSelect={false}
        blackList={component.blackList}
        whiteList={component.whiteList}
        label={component.label}
        query={component.query}
        allowCreate={component.allowCreate}
        withoutIcon
        autoFocus
        isSub={component.isSub}
        onClick={component.onClick}
        onChange={component.onChange}
        handleClose={component.handleClose}
        rosterId={component.rosterId}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.PERSON_ITEM) {
    return (
      <PersonItem
        {...component.person}
        secondary={component.secondary}
        notClickable={component.notClickable}
        secondaryActions={component.secondaryActions}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.TEXT_FIELD_BOX) {
    if (component.namespace) {
      return (
        <TextField
          namespace={component.namespace}
          formik={component.formik}
          variant={component.variant}
          multiline
          rows={component.rows}
          rowsMax={component.rowsMax}
          label={component.label}
          style={component.style}
          disabled={component.disabled}
          InputProps={component.inputProps}
        />
      );
    }
    return (
      <TextField
        namespace={component.namespace}
        variant={component.variant}
        multiline
        rows={component.rows}
        rowsMax={component.rowsMax}
        label={component.label}
        style={component.style}
        disabled={component.disabled}
        InputProps={component.inputProps}
        value={component.value}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.LINK) {
    return (
      <Typography style={{ color: 'blue', textDecoration: 'underline' }}>
        <a target="_blank" href={component.href}>
          {component.name}
        </a>
      </Typography>
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.RADIO_GROUP) {
    return (
      <RadioGroup
        namespace={component.namespace}
        options={component.options}
        title={component.title}
        onChange={component.onChange}
        value={component.value}
        defaultValue={component.defaultValue}
        type={component.type}
        row={component.row}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.FILE_UPLOAD) {
    return (
      <Upload {...component.props}>
        <Button variant="outlined" endIcon="CloudUploadIcon" style={component.style} component="label">
          {component.buttonName}
        </Button>
      </Upload>
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.IMAGE_UPLOAD) {
    return (
      <>
        <Avatar photoUrl={component.photoUrl} variant="square" size="lg" />
        <Upload {...component.uploadImageProps}>
          <Button
            variant="outlined"
            endIcon="CloudUploadIcon"
            style={{ marginTop: '8px', marginBottom: '16px' }}
            component="label"
          >
            {component.buttonName}
          </Button>
        </Upload>
      </>
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.EMPTY) {
    return <> </>;
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.TEXT_DOUBLE_BUTTON) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography component="p" style={{ alignItems: 'center' }}>
          {component.value}
        </Typography>
        <div style={{ marginLeft: 'auto' }}>
          <CustomIconButton
            icon={component.firstIcon}
            style={{ color: 'primary', marginLeft: 'auto' }}
            onClick={component.firstOnClick}
            tooltip={component.firstTooltip}
          />
        </div>
        <CustomIconButton
          icon={component.secondIcon}
          style={{ color: 'secondary' }}
          onClick={component.secondOnClick}
          tooltip={component.secondTooltip}
        />
      </div>
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.LOCATION) {
    return (
      <CustomLocations
        formik={component.formik}
        label={component.label}
        namespace={component.namespace}
        onChange={component.onChange}
        showView={component.showView}
        options={component.options}
        addressChanged={component.addressChanged}
        onAddressChanged={component.onAddressChanged}
        language={component.language}
        errorFormat={component.errorFormat}
        showCreate={component.showCreate}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.EXERCISE) {
    return (
      <CustomExercises
        formik={component.formik}
        label={component.label}
        namespace={component.namespace}
        onChange={component.onChange}
        showView={component.showView}
        options={component.options}
        showCreate={component.showCreate}
      />
    );
  }
  return (
    <TextField
      formik={component.formik}
      namespace={component.namespace}
      InputLabelProps={{ shrink: component.shrink }}
      InputProps={{
        endAdornment: component.endAdorment ? (
          <InputAdornment position="end">{component.endAdorment}</InputAdornment>
        ) : null,
        inputProps: { min: component.min, max: component.max },
        ...component.inputProps,
      }}
      id={component.id}
      label={component.label}
      type={component.type}
      defaultValue={component.defaultValue}
      disabled={component.disabled}
      color={component.color}
      variant={component.variant}
      fullWidth
      style={component.style}
      helperText={component.helperText}
      autoFocus={component.autoFocus}
      hidden={component.hidden}
      required={component.required}
      onChange={component.onChange}
    />
  );
}
