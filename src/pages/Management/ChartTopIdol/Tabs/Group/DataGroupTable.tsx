import { IDOL_TYPE } from '@/constants/idolType';
import { getChartIdolDailyVote } from '@/services/management/chart-top-idol';
import { Table } from 'antd';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import '../../../styles/styleTable.css';
import FooterTable from '../FooterTable';
import { columns } from './columns';

export interface IPagination {
  pageNumber?: number;
  pageSize?: number;
}

interface DataGroupTableProps {
  currentSelect: number | null;
  idolName: string | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const DataGroupTable: FC<DataGroupTableProps> = ({
  currentSelect,
  idolName,
  loading,
  setLoading,
}) => {
  const [resApi, setResApi] = useState<API.ResChartTopIdol>();

  const [pagination, setPagination] = useState<IPagination>({
    pageNumber: 1,
    pageSize: 15,
  });
  const handleGetIdolsGroupChart = async (isFilterChange?: boolean) => {
    setLoading(true);
    if (isFilterChange) {
      setPagination({ ...pagination, pageNumber: 1 });
    }
    const res = await getChartIdolDailyVote({
      IdolType: IDOL_TYPE.GROUP_TYPE,
      ChartType: currentSelect,
      IdolName: idolName,
      PageNumber: isFilterChange ? 1 : pagination.pageNumber ?? -1,
      PageSize: pagination.pageSize ?? -1,
    });
    setResApi(res);
    setLoading(false);
  };

  useEffect(() => {
    handleGetIdolsGroupChart(true);
  }, [currentSelect, idolName]);

  useEffect(() => {
    handleGetIdolsGroupChart();
  }, [pagination?.pageNumber]);

  return (
    <div className="wrapp-table">
      <Table
        loading={loading}
        columns={columns()}
        dataSource={resApi?.data}
        pagination={{
          showQuickJumper: true,
          defaultCurrent: 1,
          current: pagination.pageNumber,
          pageSize: pagination.pageSize,
          total: resApi?.totalCount,
          onChange: (e: number) => {
            setPagination({ ...pagination, pageNumber: e });
          },
        }}
        footer={() => <FooterTable dateValue={moment().toString()} />}
        rowClassName={'row-customize'}
      />
    </div>
  );
};

export default DataGroupTable;
