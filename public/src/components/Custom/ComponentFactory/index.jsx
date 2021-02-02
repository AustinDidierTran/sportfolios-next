import React from 'react';

import ListItemText from '@material-ui/core/ListItemText';
import CustomTextField from '../TextField';
import CustomButton from '../Button';
import CustomSelect from '../Select';
import CustomMultiSelect from '../MultiSelect';
import CustomCheckBox from '../CheckBox';
import CustomList from '../List';

import { COMPONENT_TYPE_ENUM } from '../../../../common/enums';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonSearchList from '../SearchList/PersonSearchList';
import PersonItem from '../List/PersonItem';
import Divider from '@material-ui/core/Divider';

export default function ComponentFactory(props) {
  const { component } = props;
  if (component.componentType === COMPONENT_TYPE_ENUM.SELECT) {
    return (
      <CustomSelect
        options={component.options}
        formik={component.formik}
        namespace={component.namespace}
        label={component.label}
        value={component.defaultValue}
        style={component.style}
        showtextifonlyoneoption={component?.showTextIfOnlyOneOption?.toString() || 'false'}
        disabled={component.disabled}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.MULTISELECT) {
    return (
      <CustomMultiSelect
        formik={component.formik}
        label={component.label}
        options={component.options}
        values={component.values}
        onChange={component.onChange}
        style={component.style}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.BUTTON) {
    return (
      <CustomButton
        children={component.children}
        namespace={component.namespace}
        endIcon={component.endIcon}
        onClick={component.onClick}
        style={component.style}
        variant={component.variant}
        color={component.color}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.CHECKBOX) {
    return (
      <CustomCheckBox
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
  if (component.componentType === COMPONENT_TYPE_ENUM.LIST_ITEM) {
    return (
      <ListItemText
        primary={component.primary}
        primaryTypographyProps={component.primaryTypographyProps}
        secondary={component.secondary}
        style={{ overflowWrap: 'anywhere' }}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.DIVIDER) {
    return <Divider style={component.style} />;
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.LIST) {
    return <CustomList items={component.items} />;
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.PERSON_SEARCH_LIST) {
    return (
      <PersonSearchList
        clearOnSelect={false}
        blackList={component.blackList}
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
  if (component.componentType === COMPONENT_TYPE_ENUM.EMPTY) {
    return <> </>;
  }
  return (
    <CustomTextField
      formik={component.formik}
      namespace={component.namespace}
      InputLabelProps={{ shrink: component.shrink }}
      InputProps={{
        endAdornment: component.endAdorment ? (
          <InputAdornment position="end">{component.endAdorment}</InputAdornment>
        ) : (
          <></>
        ),
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
      autoFocus={component.autoFocus}
      hidden={component.hidden}
    />
  );
}
