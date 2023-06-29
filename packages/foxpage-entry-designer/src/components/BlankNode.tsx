import React from 'react';

const BlankNode = (props: {
  children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
}) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};
export default BlankNode;
