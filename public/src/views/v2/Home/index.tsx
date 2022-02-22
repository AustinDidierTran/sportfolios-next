import React from 'react';

interface Props {
  label: string;
}

const Home: React.FunctionComponent<Props> = (props) => {
  return <div>{props.label}</div>;
};

export default Home;
