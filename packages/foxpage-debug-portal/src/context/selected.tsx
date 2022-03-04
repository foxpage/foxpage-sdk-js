import React from 'react';

import { StructureNode } from '@foxpage/foxpage-types';

const SelectedContext = React.createContext<StructureNode<any> | null>(null);

export default SelectedContext;
