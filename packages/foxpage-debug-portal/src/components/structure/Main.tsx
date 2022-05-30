import React, { useEffect, useState } from 'react';

import { Input, Select } from 'antd';
import styled from 'styled-components';

import { StructureNode, Template } from '@foxpage/foxpage-types';

import { SelectedContext } from '../../context';
import { getPage, getStructures, getTemplates } from '../../main';

import Details from './Detail';
import Structure from './Structure';

const { Search } = Input;
const { Option } = Select;

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const Structures = styled.div`
  flex: 0 0 500px;
  border-right: 1px dashed #ddd;
`;

const SearchContainer = styled.div`
  /* text-align: center; */
  padding: 6px 12px 6px 0;
  border-bottom: 1px dashed #ddd;
  margin-bottom: 6px;
`;

const DetailContainer = styled.div`
  flex-grow: 1;
  overflow: auto;
`;

const TemplateTitle = styled.p`
  margin: 0;
  border-left: 2px solid #f9bc61;
  padding: 0 4px;
  background-color: #f5f5f5;
  line-height: 24px;
`;

const options = ['parsed', 'page', 'template'];

function StructureContainer() {
  const [type, setType] = useState(options[0]);
  const [selected, setSelected] = useState<StructureNode<any> | null>(null);
  const [structures, setStructures] = useState<StructureNode<any>[] | []>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    if (type === options[0]) {
      setStructures(getStructures());
    } else if (type === options[1]) {
      const page = getPage();
      const list = page?.schemas || [];
      if (list.length > 0) {
        list[0].name = 'page';
        list[0].label = 'page';
      }
      setStructures(list);
    } else {
      const templateList = getTemplates();
      setTemplates(templateList);
      setStructures([]);
    }
  }, [type]);

  const onSearch = (value: string) => {
    console.log(value);
  };

  const handleSelect = (node: StructureNode<any>) => {
    setSelected(node);
  };

  const handleTypeChange = (value: string) => {
    if (value !== type) {
      setType(value);
      setSelected(null);
    }
  };

  return (
    <Container>
      <SelectedContext.Provider value={selected}>
        <Structures>
          <SearchContainer>
            <Search
              addonBefore={
                <Select value={type} className="select-before" style={{ width: 100 }} onChange={handleTypeChange}>
                  {options.map(item => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              }
              placeholder="input search text"
              onSearch={onSearch}
              style={{ width: '100%' }}
            />
          </SearchContainer>
          {type === options[2] ? (
            <>
              {templates.map((item, index) => (
                <React.Fragment key={index}>
                  {templates.length > 1 && <TemplateTitle>{item.id}</TemplateTitle>}
                  <Structure structures={item.schemas} onSelect={handleSelect} />
                </React.Fragment>
              ))}
            </>
          ) : (
            <Structure structures={structures} onSelect={handleSelect} />
          )}
        </Structures>
        <DetailContainer>
          <Details />
        </DetailContainer>
      </SelectedContext.Provider>
    </Container>
  );
}

export default StructureContainer;
