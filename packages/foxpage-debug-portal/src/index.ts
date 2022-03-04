import { createElement } from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { DEBUG_PORTAL_MOUNT_NODE } from './constant';
import { getDebugState } from './main';

getDebugState();

// @ts-ignore
ReactDOM.render(createElement(App, {}, null), document.getElementById(DEBUG_PORTAL_MOUNT_NODE));
