import { getIdols } from '@/services/management/idols';
import { Table } from 'antd';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import FooterTable from '../ChartTopIdol/Tabs/FooterTable';
import { IPagination } from '../ChartTopIdol/Tabs/Group/DataGroupTable';
import '../styles/styleTable.css';
import { configColumns } from './columns';

interface DataIdolsTableProps {
  handleSetCurIdol: (x: API.IdolItem) => void;
  currentType: number | null;
  reload?: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalForm: React.Dispatch<React.SetStateAction<boolean>>;
  currentEsalisday: string | null;
  currentName: string | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataIdolsTable: FC<DataIdolsTableProps> = ({
  handleSetCurIdol,
  currentType,
  reload,
  setReload,
  setShowModalForm,
  currentEsalisday,
  currentName,
  loading,
  setLoading,
}) => {
  const [resApi, setResApi] = useState<API.ResChartTopIdol>();
  const [pagination, setPagination] = useState<IPagination>({
    pageNumber: 1,
    pageSize: 15,
  });

  const handleReload = () => {
    setReload((pre) => !pre);
  };

  const handleSetShowModalForm = () => {
    setShowModalForm(true);
  };

  const handleGetIdols = async (isFilterChange?: boolean) => {
    setLoading(true);
    if (isFilterChange) {
      setPagination({ ...pagination, pageNumber: 1 });
    }
    const res = await getIdols({
      idolType: currentType,
      estalisday: currentEsalisday === 'NaN-NaN-NaN' ? null : currentEsalisday,
      idolName: currentName,
      PageNumber: pagination.pageNumber ?? -1,
      PageSize: pagination.pageSize ?? -1,
    });
    setResApi(res);
    setLoading(false);
  };

  useEffect(() => {
    handleGetIdols(true);
  }, [currentType, reload, currentEsalisday, currentName]);

  useEffect(() => {
    handleGetIdols();
  }, [pagination?.pageNumber]);

  return (
    <div className="wrapp-table">
      <Table
        loading={loading}
        columns={configColumns(handleSetCurIdol, handleReload, handleSetShowModalForm)}
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

export default DataIdolsTable;
