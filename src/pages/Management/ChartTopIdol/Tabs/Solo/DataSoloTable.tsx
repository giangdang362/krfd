import { IDOL_TYPE } from '@/constants/idolType';
import { getChartIdolDailyVote } from '@/services/management/chart-top-idol';
import { Table } from 'antd';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import '../../../styles/styleTable.css';
import FooterTable from '../FooterTable';
import { IPagination } from '../Group/DataGroupTable';
import { columns } from './columns';

interface DataSoloTableProps {
  currentSelect: number | null;
  idolName: string | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataSoloTable: FC<DataSoloTableProps> = ({
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

  const handleGetIdolsSoloChart = async (isFilterChange?: boolean) => {
    setLoading(true);
    if (isFilterChange) {
      setPagination({ ...pagination, pageNumber: 1 });
    }
    const res = await getChartIdolDailyVote({
      IdolType: IDOL_TYPE.SOLO_TYPE,
      ChartType: currentSelect,
      IdolName: idolName,
      PageNumber: isFilterChange ? 1 : pagination.pageNumber ?? -1,
      PageSize: pagination.pageSize ?? -1,
    });
    setResApi(res);
    setLoading(false);
  };

  useEffect(() => {
    handleGetIdolsSoloChart(true);
  }, [currentSelect, idolName]);

  useEffect(() => {
    handleGetIdolsSoloChart();
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
      />
    </div>
  );
};

export default DataSoloTable;
