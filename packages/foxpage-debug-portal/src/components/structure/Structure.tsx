import React, { useContext, useState } from 'react';

import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { StructureNode } from '@foxpage/foxpage-types';

import { SelectedContext } from '../../context';

type IProps = {
  structures: StructureNode<any>[];
  onSelect?: (node: StructureNode<any>) => void;
};

const Container = styled.div`
  padding-left: 12px;
  height: calc(100% - 60px);
  overflow: auto;
`;

const ArrowIcon = styled.span`
  position: absolute;
  left: -16px;
  top: 3px;
  > span {
    transform: scale(0.8);
  }
`;

const Node = styled.div`
  position: relative;
  cursor: pointer;
`;

type NameProps = { isactive: boolean };
const Name = styled.span`
  line-height: 28px;
  display: inline-block;
  padding: 0 4px;
  :hover {
    background-color: ${(props: NameProps) => (props.isactive ? '#bae7ff' : '#f5f5f5')};
  }
  background-color: ${(props: NameProps) => (props.isactive ? '#bae7ff' : '#fff')};
  border-radius: 4px;
`;

const Children = styled.div`
  padding-left: 24px;
`;

function Structure(props: IProps) {
  const [closes, setCloses] = useState<Record<string, boolean>>({});
  const selected = useContext(SelectedContext);
  const { structures, onSelect } = props;

  const handleClose = (id: string) => {
    setCloses(Object.assign({}, closes, { [id]: !closes[id] }));
  };

  const handleSelected = (node: StructureNode<any>) => {
    if (typeof onSelect === 'function') {
      onSelect(node);
    }
  };

  const renderNode = (list: StructureNode<any>[] = []) => {
    return list.map(node => {
      const withChildren = node.children && node.children.length > 0;
      const expanded = !closes[node.id];
      return (
        <div key={node.id}>
          <Node>
            {withChildren && (
              <ArrowIcon onClick={() => handleClose(node.id)}>
                {expanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
              </ArrowIcon>
            )}
            <Name isactive={selected?.id === node.id} onClick={() => handleSelected(node)}>
              {node.name}
            </Name>
          </Node>
          {withChildren && expanded && <Children>{renderNode(node.children)}</Children>}
        </div>
      );
    });
  };

  return <Container>{renderNode(structures)}</Container>;
}

export default Structure;
