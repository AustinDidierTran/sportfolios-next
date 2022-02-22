import React from 'react';

interface Props {
  label: string;
}

const StyledHeader: React.FunctionComponent<Props> = (props) => {
  return <div>{props.label}</div>;
};

export default StyledHeader;
