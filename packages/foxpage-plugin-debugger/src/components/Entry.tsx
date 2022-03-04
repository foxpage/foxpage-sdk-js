import React, { FC, Fragment } from 'react';

export const DEBUG_PORTAL_MOUNT_NODE = 'foxpage-debug-container';

export const DebugEntry: FC<Record<string, any>> = ({ url }) => {
  return (
    <Fragment>
      <div id={DEBUG_PORTAL_MOUNT_NODE}></div>
      {url && <script src={url} defer={true} />}
    </Fragment>
  );
};

DebugEntry.displayName = 'DebugEntry';
