import { CHART_TOP_IDOL_TYPE } from '@/constants/chartTopIdolType';
import { SearchOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Input, Select } from 'antd';
import debounce from 'lodash/debounce';
import { useState } from 'react';
import DataSoloTable from './DataSoloTable';

type SelectType = {
  label: string;
  value: number;
};

const listSelect: SelectType[] = [
  { label: 'Daily Chart', value: CHART_TOP_IDOL_TYPE.DAILY_CHART_TYPE },
  { label: 'Monthly Chart', value: CHART_TOP_IDOL_TYPE.MONTHLY_CHART_TYPE },
];

const SoloChartTopIdol = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSelect, setCurrentSelect] = useState<number | null>(null);
  const [idolName, setIdolName] = useState<string | null>(null);
  const handleProvinceChange = (value: number) => {
    setCurrentSelect(value);
  };
  const handleIdolNameChange = debounce((x: string) => {
    setIdolName(x);
  }, 1000);

  return (
    <div>
      <ProForm submitter={false}>
        <div
          style={{
            width: '50%',
            display: 'flex',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <Input
            style={{
              width: '200px',
            }}
            placeholder={`${intl.formatMessage({
              id: 'pages.chartTopIdol.solo.placeholderSearch',
              defaultMessage: 'Search by name',
            })}`}
            prefix={<SearchOutlined />}
            onChange={(e) => handleIdolNameChange(e.target.value)}
            allowClear
          />
          <Select
            allowClear
            style={{
              width: '200px',
            }}
            options={listSelect.map((op) => ({ label: op.label, value: op.value }))}
            onChange={handleProvinceChange}
            defaultValue={currentSelect}
            placeholder={'Select Chart Type'}
          />
        </div>
      </ProForm>
      <DataSoloTable
        currentSelect={currentSelect}
        idolName={idolName}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
};

export default SoloChartTopIdol;
