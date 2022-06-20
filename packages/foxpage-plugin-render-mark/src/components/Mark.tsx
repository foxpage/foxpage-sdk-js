import React, { FC } from 'react';

export const Mark: FC<Record<string, any>> = props => {
  const { componentId = '', componentType = '', componentName = '', children } = props;
  return (
    <div
      id={componentId}
      data-component-id={componentId}
      data-component-type={componentType}
      data-component-name={componentName}
      style={{ position: 'relative' }}
    >
      {children}
    </div>
  );
};

Mark.displayName = 'Mark';
