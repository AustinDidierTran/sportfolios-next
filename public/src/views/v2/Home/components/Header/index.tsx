import React from 'react';

interface Props {
  label: string;
}

const HomeHeader: React.FunctionComponent<Props> = (props) => {
  return <div>{props.label}</div>;
};

export default HomeHeader;
