import { IDOL_TYPE } from '@/constants/idolType';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, DatePicker, DatePickerProps, Input, Select, Typography } from 'antd';
import { debounce } from 'lodash';
import { useState } from 'react';
import CreateUpdateForm from './CreateUpdateForm';
import DataIdolsTable from './DataTable';

const { Title } = Typography;

export type SelectType = {
  label: string;
  value: number;
};

export const typeSelect: SelectType[] = [
  { label: 'Solo', value: IDOL_TYPE.SOLO_TYPE },
  { label: 'Group', value: IDOL_TYPE.GROUP_TYPE },
];

const IdolsManagement = () => {
  const intl = useIntl();
  const [curIdol, setCurIdol] = useState<API.IdolItem>({});
  const [reload, setReload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentEsalisday, setCurrentEsalisday] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<number | null>(null);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [currentName, setCurrentName] = useState<string | null>(null);

  const handleSetCurIdol = (x: API.IdolItem) => {
    setCurIdol(x);
  };

  const onChange: DatePickerProps['onChange'] = (_: any, dateString: string) => {
    setCurrentEsalisday(dateString);
  };

  const handleTypeChange = debounce((x: number) => {
    setCurrentType(x);
  }, 1000);

  const handleNameChange = (x: string) => {
    setCurrentName(x);
  };

  return (
    <div>
      <Title level={3}>
        {intl.formatMessage({
          id: 'pages.idols.title',
          defaultMessage: 'Idols Management',
        })}
      </Title>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '12px',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            gap: '10px',
          }}
        >
          <Input
            style={{
              width: '200px',
              marginBottom: '24px',
            }}
            placeholder={`${intl.formatMessage({
              id: 'pages.chartTopIdol.solo.placeholderSearch',
              defaultMessage: 'Search by name',
            })}`}
            prefix={<SearchOutlined />}
            onChange={(e) => handleNameChange(e.target.value)}
            allowClear
          />
          <DatePicker
            picker="month"
            placeholder={`${intl.formatMessage({
              id: 'pages.idols.placeholderEsal',
              defaultMessage: 'Select Esalisday',
            })}`}
            onChange={onChange}
            style={{
              width: 200,
              height: 32,
            }}
          />
          <Select
            allowClear
            placeholder={`${intl.formatMessage({
              id: 'pages.idols.placeholderType',
              defaultMessage: 'Type',
            })}`}
            style={{
              width: '200px',
            }}
            options={typeSelect.map((op) => ({ label: op.label, value: op.value }))}
            onChange={handleTypeChange}
          />
        </div>
        <Button
          type="primary"
          style={{
            display: 'flex',
            gap: '2px',
            alignItems: 'center',
          }}
          onClick={() => setShowModalForm(true)}
        >
          <PlusOutlined />
          <span>
            {intl.formatMessage({
              id: 'pages.button.add',
              defaultMessage: 'Add',
            })}
          </span>
        </Button>
      </div>
      <DataIdolsTable
        handleSetCurIdol={handleSetCurIdol}
        currentType={currentType}
        reload={reload}
        setReload={setReload}
        setShowModalForm={setShowModalForm}
        currentEsalisday={currentEsalisday}
        currentName={currentName}
        loading={loading}
        setLoading={setLoading}
      />
      <CreateUpdateForm
        showModal={showModalForm}
        setShowModal={setShowModalForm}
        curItem={curIdol}
        setReload={setReload}
        setCurIdol={setCurIdol}
      />
    </div>
  );
};

export default IdolsManagement;
